const { AuthenticationError } = require("apollo-server-express");
const { User, Post } = require("../../models");

module.exports = {
  posts: async (parent, args, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError("You need to be logged in!");
    }

    return Post.find()
      .select("-__v")
      .populate("comments")
      .populate("likes")
      .populate({
        path: "postAuthor",
        select: "-__v -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "commentAuthor",
          model: "User",
        },
      })
      .populate({
        path: "likes",
        model: "User"
      });
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

      return post.populate({
        path: "postAuthor",
        select: "-__v -password",
      });
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

    // check if the post exists
    const post = await Post.findOne({ _id: postId });

    if (!post) {
        throw new AuthenticationError("Post does not exist!");
    } 

    // check if the logged in user is the post author or is an admin
    if (post.postAuthor.toString() !== context.user._id.toString() && !context.user.isAdmin) {
        throw new AuthenticationError("You are not authorized to delete this post!");
    }

    const deletedPost = await Post.findOneAndDelete({ _id: postId });

    return {
      success: true,
      message: "Post deleted!",
    };
  },
};
