const { User, Post, Comment } = require("../../models");

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

    return Post.findOne({ _id: postId });
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

  addComment: async (parent, { postId, commentText }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError("You need to be logged in!");
    }

    // create a new comment
    const addComment = await Comment.create({
      commentText: commentText,
      commentAuthor: context.user._id,
    });

    // update the post with the new comment
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: addComment._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedPost;
  },
};
