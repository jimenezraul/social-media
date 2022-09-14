const { AuthenticationError } = require("apollo-server-express");
const { User, Post } = require("../models");
const { generateToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("posts")
          .populate("comments");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("posts")
        .populate("comments");
    },
    user: async (parent, { id }) => {
      return User.findOne({ _id: id })
        .select("-__v -password")
        .populate("posts")
        .populate("comments");
    },
    posts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Post.find(params).sort({ createdAt: -1 });
    },
    post: async (parent, { id }) => {
      return Post.findOne({ _id: id });
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      // check if user already exists
      const userExists = await User.findOne({ email: args.email });

      if (userExists) {
        throw new AuthenticationError("Email already exists");
      }

      // create new user and add accessToken and refreshToken
      const user = await User.create(args);
      user.accessToken = generateToken(args);
      user.refreshToken = generateToken(args, "refresh");
      await user.save();

      return {
        message: "User created successfully",
        verification: "Please check your email to verify your account",
      };
    },
    login: async (parent, { email, password }, context) => {
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

      if (user.refreshToken) {
        throw new AuthenticationError("You are already logged in");
      }

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

      // save tokens to user
      user.refreshToken = refreshToken;
      await user.save();

      // set httpOnly cookie
      context.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return { message: "Logged in successfully" };
    },
    addPost: async (parent, args, context) => {
      if (context.user) {
        const post = await Post.create({
          ...args,
          username: context.user.username,
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
