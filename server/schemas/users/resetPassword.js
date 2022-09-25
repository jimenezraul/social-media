const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../../models');

module.exports = {
  // Reset password
  resetPassword: async (parent, args) => {
    const { password, token } = args;

    const user = await User.findOne({ accessToken: token });

    if (!user) {
      throw new AuthenticationError('Invalid token');
    }

    user.password = password;

    user.accessToken = null;

    await user.save();
    return {
      success: true,
      message: 'Password reset successfully',
    };
  },
};