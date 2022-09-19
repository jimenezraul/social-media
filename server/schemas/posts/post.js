const { AuthenticationError } = require("apollo-server-express");
const { User, Post } = require("../../models");

module.exports = {
  posts: async (parent, args, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError("You need to be logged in!");
    }

    return Post.find({ postAuthor: context.user._id })
      .select("-__v")
      .populate("comments")
      .populate("likes");
  },

  post: async (parent, { postId }, context) => {
    const loggedUser = context.user;
    
    if (!loggedUser) {
      throw new AuthenticationError("You need to be logged in!");
    }

    return Post.findOne({ _id: postId })
      .select("-__v")
      .populate("comments")
      .populate("likes");
  },

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

  updatePost: async (parent, { postId, postText }, context) => {
    if (!context.user) {
      throw new AuthenticationError("You need to be logged in!");
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { postText },
      { new: true }
    );

    return {
      success: true,
      message: "Post updated!",
    };
  },

  deletePost: async (parent, { postId }, context) => {
    if (!context.user) {
      throw new AuthenticationError("You need to be logged in!");
    }

    const deletedPost = await Post.findOneAndDelete({ _id: postId });

    return {
      success: true,
      message: "Post deleted!",
    };
  },
};
