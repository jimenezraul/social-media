const { AuthenticationError } = require("apollo-server-express");
const { User, Post, Comment } = require("../models");
const { generateToken } = require("../utils/auth");
const { sendVerificationEmail } = require("../utils/accountVerification");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("posts")

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("posts")
    },
    user: async (parent, { id }) => {
      return User.findOne({ _id: id })
        .select("-__v -password")
        .populate("posts")
    },
    posts: async (parent, args, context) => {
      if (context.user) {
        return Post.find({ postAuthor: context.user._id })
        .select("-__v")
        .populate("comments")
        .populate("likes");
      }

      throw new AuthenticationError("Not logged in");
    },
    post: async (parent, { id }) => {
      return Post.findOne({ _id: id });
    },
  },
  Mutation: {
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
      const accessToken = generateToken(data);
      const refreshToken = generateToken(data, "refresh");

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

    // New Post
    addPost: async (parent, args, context) => {
      if (context.user) {
        const user = context.user;
        const post = await Post.create({
          ...args,
          postAuthor: user._id,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { posts: post._id } },
          { new: true }
        );

        return post;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    // Add Comment
    addComment: async (parent, { postId, commentText }, context) => {
      if (context.user) {
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId },
          {
            $push: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        return updatedPost;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
