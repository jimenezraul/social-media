const { GraphQLError } = require('graphql');
const { User } = require('../../models');
const { generateToken } = require('../../utils/auth');
const { sendVerificationEmail } = require('../../utils/accountVerification');

module.exports = {
  //register a new user
  register: async (parent, args) => {
    // check if user already exists
    const userExists = await User.findOne({ email: args.email });

    if (userExists) {
      throw new GraphQLError('Email already exists', {
        extensions: {
          code: 'EMAIL_ALREADY_EXISTS',
        },
      });
    }

    const token = generateToken(args);

    // create new user and add accessToken
    const user = await User.create(args);
    user.accessToken = token;
    await user.save();

    // send verification email
    await sendVerificationEmail(user, token);

    return {
      success: true,
      message: 'Account created successfully',
      subMessage: 'Please check your email to verify your account',
    };
  },
};
