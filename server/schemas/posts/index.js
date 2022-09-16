const { User, Post } = require("../../models");

module.exports = {
  posts: async (parent, args, context) => {
    if (context.user) {
      return Post.find({ postAuthor: context.user._id })
        .select("-__v")
        .populate("comments")
        .populate("likes");
    }

    throw new AuthenticationError("Not logged in");
  },
  post: async (parent, { postId }) => {
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
};
