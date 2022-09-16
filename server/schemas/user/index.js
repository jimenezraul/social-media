const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../../models");
const { generateToken } = require("../../utils/auth");
const { sendVerificationEmail } = require("../../utils/accountVerification");

module.exports = {
  // Query for current user
  me: async (parent, args, context) => {
    if (context.user) {
      const userData = await User.findOne({ _id: context.user._id })
        .select("-__v -password")
        .populate("posts");

      return userData;
    }

    throw new AuthenticationError("Not logged in");
  },
  // Query for all users
  users: async () => {
    return User.find().select("-__v -password").populate("posts");
  },
  // Query for a single user by id
  user: async (parent, { id }) => {
    return User.findOne({ _id: id }).select("-__v -password").populate("posts");
  },

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

  // login a user
  login: async (parent, { email, password }, context) => {
    const refresh_token = context.headers.cookie?.split("=")[1];
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError("Incorrect credentials");
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError("Incorrect credentials");
    }

    if (!user.isVerified) {
      throw new AuthenticationError("Please verify your email.");
    }

    // user data to be sent to client
    const data = {
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      _id: user._id,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    };

    //generate new tokens
    const accessToken = generateToken({ user: data });
    const refreshToken = generateToken({ _id: data._id }, "refresh");

    // If refresh token exists in cookie, get new array of tokens without the old refresh token
    let newRefreshTokenArray = !refresh_token
      ? user.refreshToken
      : user.refreshToken.filter((token) => token !== refresh_token);

    if (refresh_token) {
      // clear httpOnly cookie
      context.res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    // save tokens to user
    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    await user.save();

    // set httpOnly cookie
    context.res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return {
      message: "Logged in successfully",
      access_token: accessToken,
      user,
    };
  },
};
