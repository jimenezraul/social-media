const { GraphQLError } = require('graphql');
const { User } = require('../../models');
const { generateToken } = require('../../utils/auth');
const { sendResetPassEmail } = require('../../utils/sendResetPassEmail');
require('dotenv').config();

module.exports = {
  // sent reset password email
  forgotPassword: async (parent, args) => {
    const { email } = args;

    const user = await User.findOne({ email });

    if (!user) {
      throw new GraphQLError('Email not found', {
        extensions: {
          code: 'EMAIL_NOT_FOUND',
        },
      });
    }

    if (user.provider !== 'email') {
      throw new GraphQLError(`Sign in with ${user.provider}`, {
        extensions: {
          code: 'SIGN_IN_WITH_SOCIAL',
        },
      });
    }

    const accessToken = generateToken({ user: user._id });

    user.accessToken = accessToken;
    await user.save();

    sendResetPassEmail(user.email, accessToken);

    return {
      success: true,
      message: 'Email sent successfully',
    };
  },
};
