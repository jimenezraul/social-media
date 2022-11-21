const { User } = require('../../models');

module.exports = {
  // Verify user account
  verifyUser: async (parent, args) => {
    const user = await User.findOne({ accessToken: args.token });

    if (!user) {
      return {
        success: false,
        message: 'Invalid Token',
      };
    }

    user.isVerified = true;
    user.accessToken = null;
    await user.save();

    return {
      success: true,
      message: 'Account Verified',
    };
  },
};
