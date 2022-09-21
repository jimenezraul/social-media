const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");
const { generateToken, validToken } = require("../../utils/auth");
const { sendVerificationEmail } = require("../../utils/accountVerification");
const {clearCookie} = require("../../utils/cookies");

module.exports = {
  // logout user
  logout: async (parent, args, context) => {
    const token = context.headers.cookie?.split("=")[1];
    const loggedUser = context?.user;

    if (!loggedUser) {
      throw new AuthenticationError("You are not logged in");
    }

    if (!token) {
      throw new AuthenticationError("No refresh token found");
    }

    // clear httpOnly cookie
    clearCookie(context.res, "refresh_token");

    const user = await User.findOne({ _id: loggedUser._id });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (token) => token !== token
    );

    await User.findOneAndUpdate(
      { _id: loggedUser._id },
      { $set: { refreshToken: newRefreshTokenArray } },
      { new: true }
    );

    return {
      success: true,
      message: "User logged out successfully",
      isLoggedIn: false,
    };
  },
};