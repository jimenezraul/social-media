const User = require('../../models');
const { GraphQLError } = require('graphql');

module.exports = {
  // resend verification email
  resendVerificationEmail: async (parent, args) => {
    const { email } = args;

    const user = await User.findOne({ email });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'USER_NOT_FOUND',
        },
      });
    }

    if (user.isVerified) {
      throw new GraphQLError('User already verified', {
        extensions: {
          code: 'USER_ALREADY_VERIFIED',
        },
      });
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
