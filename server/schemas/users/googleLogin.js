const { OAuth2Client } = require("google-auth-library");
const { User } = require("../../models");
const { generateToken } = require("../../utils/auth");
const { AuthenticationError } = require("apollo-server-express");
require("dotenv").config();

module.exports = {
  googleLogin: async (parent, args, context) => {
    const refresh_token = context.headers.cookie?.split("=")[1];

    let tokenId =
      context.headers.authorization || context.headers.Authorization;
    tokenId = tokenId?.split(" ").pop().trim();

    const { idToken } = args;
    const url = "https://www.googleapis.com/userinfo/v2/me";
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

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

    // if user exists, return user
    if (user) {
      // If refresh token exists in cookie, get new array of tokens without the old refresh token
      let newRefreshTokenArray = !refresh_token
        ? user.refreshToken
        : user.refreshToken.filter((token) => token !== refresh_token);

      if (refresh_token) {
        // clear httpOnly cookie
        context.res.clearCookie("refresh_token", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }
      const data = {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        _id: user._id,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      };

      const token = generateToken({ user: data });
      const refreshToken = generateToken({ user: data }, "refresh");

      user.refreshToken = [...newRefreshTokenArray, refreshToken];
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
    // get the new user withouth the password
    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    const data = {
      email: userWithoutPassword.email,
      given_name: userWithoutPassword.given_name,
      family_name: userWithoutPassword.family_name,
      _id: userWithoutPassword._id,
      isAdmin: userWithoutPassword.isAdmin,
      isVerified: userWithoutPassword.isVerified,
    };
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
