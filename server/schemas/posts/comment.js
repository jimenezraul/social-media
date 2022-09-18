const { AuthenticationError } = require("apollo-server-express");
const { Post, Comment } = require("../../models");

module.exports = {
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

  removeComment: async (parent, { postId, commentId }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError("You need to be logged in!");
    }

    // delete the comment
    const removeComment = await Comment.findOneAndDelete({
      _id: commentId,
    });

    // update the post with the new comment
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: {
          comments: commentId,
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
