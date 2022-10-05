const User = require('../../models');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  // resend verification email
  resendVerificationEmail: async (parent, args) => {
    const { email } = args;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.isVerified) {
      throw new AuthenticationError('User already verified');
    }

    const accessToken = generateToken({ user: user._id });

    user.accessToken = accessToken;
    await user.save();

    sendVerificationEmail(email, accessToken);

    return {
      success: true,
      message: 'Email sent successfully',
    };
  },
};
