const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");
const { generateToken, validToken } = require("../../utils/auth");
const { sendVerificationEmail } = require("../../utils/accountVerification");

module.exports = {
  // logout user
  logout: async (parent, args, context) => {
    const token = context.headers.cookie?.split("=")[1];
    const loggedUser = context?.user;

    // clear httpOnly cookie
    context.res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    if (!token) {
      throw new AuthenticationError("No refresh token found");
    }

    const user = await User.findOne({ _id: loggedUser._id });

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (token) => token !== token
    );

    user.refreshToken = newRefreshTokenArray;
    await user.save();

    return {
      message: "User logged out successfully",
    };
  },
};
