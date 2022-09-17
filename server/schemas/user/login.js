const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");
const { generateToken } = require("../../utils/auth");

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
    const data = {
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      _id: user._id,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    };

    //generate new tokens
    const accessToken = generateToken({ user: data });
    const refreshToken = generateToken({ user: data }, "refresh");

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

    // save tokens to user
    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    await user.save();

    // set httpOnly cookie
    context.res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return {
      message: "Logged in successfully",
      access_token: accessToken,
      user,
    };
  },
};
