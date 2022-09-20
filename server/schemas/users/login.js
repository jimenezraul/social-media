const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");
const { generateToken } = require("../../utils/auth");
const { formatUserData } = require("../../utils/formatUserData");
const { setCookie, clearCookie } = require("../../utils/cookies");

module.exports = {
  // login a user
  login: async (parent, { email, password }, context) => {
    const refresh_token = context.headers.cookie?.split("=")[1];
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError("Incorrect credentials");
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError("Incorrect credentials");
    }

    if (!user.isVerified) {
      throw new AuthenticationError("Please verify your email.");
    }

    // user data to be sent to client
    const data = formatUserData(user);

    //generate new tokens
    const accessToken = generateToken({ user: data });
    const refreshToken = generateToken({ user: data }, "refresh");

    // If refresh token exists in cookie, get new array of tokens without the old refresh token
    let newRefreshTokenArray = !refresh_token
      ? user.refreshToken
      : user.refreshToken.filter((token) => token !== refresh_token);

    if (refresh_token) {
      // clear httpOnly cookie
      clearCookie(context.res, "refresh_token");
    }

    // save tokens to user
    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    await user.save();

    // set httpOnly cookie
    setCookie(context.res, "refresh_token", refreshToken);

    return {
      success: true,
      message: "Logged in successfully",
      access_token: accessToken,
      user,
      isLoggedIn: true,
    };
  },
};
