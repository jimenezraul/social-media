const { OAuth2Client } = require("google-auth-library");
const { User } = require("../../models");
const { generateToken } = require("../../utils/auth");
const { AuthenticationError } = require("apollo-server-express");
const { validToken } = require("../../utils/auth");
require("dotenv").config();

module.exports = {
  googleLogin: async (parent, args, context) => {
    const refresh_token = context.headers.cookie?.split("=")[1];
    const { idToken } = args;
    const url = "https://www.googleapis.com/userinfo/v2/me";

    let tokenId =
      context.headers.authorization || context.headers.Authorization;
    tokenId = tokenId?.split(" ").pop().trim();

    if (!tokenId) {
      throw new AuthenticationError("You need to be logged in with Google!");
    }

    function clearCookie() {
      context.res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    // If refresh token exists in cookie and is valid,
    if (refresh_token) {
      // check if token is valid and not expired
      const isValid = validToken(refresh_token);

      if (!isValid) {
        clearCookie();
        throw new AuthenticationError("You need to try logging in again!");
      }
      // check if token exists in user.refreshtokens
      const user = await User.findOne({
        refreshToken: refresh_token,
      }).select("given_name family_name email isVerified isAdmin profileUrl");

      if (!user) {
        clearCookie();
        throw new AuthenticationError("You need to try logging in again!");
      }

      const token = generateToken({ user: user });

      return {
        success: true,
        message: "You are logged in!",
        access_token: token,
        user: user,
        isLoggedIn: true,
      };
    }

    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });

    let response = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    response = response.getPayload();

    if (
      response.iss !== "accounts.google.com" &&
      response.aud !== process.env.GOOGLE_CLIENT_ID
    ) {
      throw new AuthenticationError("You need to be logged in with Google!");
    }

    client.setCredentials({ access_token: tokenId });
    const oAuth2Client = client;
    const res = await oAuth2Client.request({ url });

    if (!res.data) {
      throw new AuthenticationError("User not found");
    }

    const { email, picture, given_name, family_name } = res.data;

    const user = await User.findOne({ email });

    if (user && user.provider !== "google") {
      throw new AuthenticationError(
        "Please login with your email and password"
      );
    }

    const setCookie = (token) => {
      context.res.cookie("refresh_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    };

    function userData(user) {
      return {
        _id: user._id,
        given_name: user.given_name,
        family_name: user.family_name,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        profileUrl: user.profileUrl,
      };
    }

    // if user exists, return user
    if (user) {
      const currentRefreshToken = user.refreshToken;
      const data = userData(user);

      const token = generateToken({ user: data });
      const refreshToken = generateToken({ user: data }, "refresh");

      user.refreshToken = [...currentRefreshToken, refreshToken];
      await user.save();

      setCookie(refreshToken);

      return {
        success: true,
        message: "User logged in",
        access_token: token,
        user: user,
      };
    }

    // if user does not exist, create new user
    const newUser = await User.create({
      email,
      given_name,
      family_name,
      profileUrl: picture,
      provider: "google",
      isVerified: true,
      password: process.env.GOOGLE_CLIENT_SECRET,
    });

    const data = userData(newUser);
    const token = generateToken({ user: data });
    const refreshToken = generateToken({ user: data }, "refresh");

    setCookie(refreshToken);

    newUser.refreshToken = [refreshToken];
    await newUser.save();

    return {
      success: true,
      message: "User created successfully",
      access_token: token,
      user: newUser,
    };
  },
};
