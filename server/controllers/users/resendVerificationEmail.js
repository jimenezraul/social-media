const User = require('../../models');
const { GraphQLError } = require('graphql')

module.exports = {
  // resend verification email
  resendVerificationEmail: async (parent, args) => {
    const { email } = args;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ForbiddenError('User not found');
    }

    if (user.isVerified) {
      throw new ForbiddenError('User already verified');
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
