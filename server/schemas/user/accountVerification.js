const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");

module.exports = {
  // Verify user account
  verifyUser: async (parent, args) => {
    const user = await User.findOne({ accessToken: args.token });

    if (!user) {
      throw new AuthenticationError("Invalid token");
    }

    user.isVerified = true;
    user.accessToken = null;
    await user.save();

    return {
      message: "Account verified successfully",
    };
  },
};
