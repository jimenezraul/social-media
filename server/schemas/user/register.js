const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");
const { generateToken } = require("../../utils/auth");
const { sendVerificationEmail } = require("../../utils/accountVerification");

module.exports = {
  //register a new user
  addUser: async (parent, args) => {
    // check if user already exists
    const userExists = await User.findOne({ email: args.email });

    if (userExists) {
      throw new AuthenticationError("Email already exists");
    }
    const token = generateToken(args);
    // create new user and add accessToken and refreshToken
    const user = await User.create(args);
    user.accessToken = token;
    await user.save();

    // send verification email
    await sendVerificationEmail(user, token);

    return {
      message: "User created successfully",
      verification: "Please check your email to verify your account",
    };
  },
};
