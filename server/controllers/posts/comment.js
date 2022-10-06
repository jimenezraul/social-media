const { AuthenticationError } = require('apollo-server-express');
const { Post, Comment } = require('../../models');

module.exports = {
  addComment: async (parent, { postId, commentText }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }

    // create a new comment
    const addComment = await Comment.create({
      commentText: commentText,
      commentAuthor: context.user._id,
    });

    const comment = await Comment.findOne({ _id: addComment._id }).populate(
      'commentAuthor'
    );

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

    return comment;
  },

  // update a comment
  updateComment: async (parent, { commentId, commentText }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }

    // update the comment
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId },
      { commentText },
      { new: true, runValidators: true }
    );

    return updatedComment;
  },

  // delete a comment
  deleteComment: async (parent, { postId, commentId }, context) => {
   
    if (!context.user) {
      throw new AuthenticationError('You need to be logged in!');
    }

    // delete the comment
    const removeComment = await Comment.findOneAndDelete({
      _id: commentId,
    });

    if (!removeComment) {
      throw new Error('Comment not found');
    }

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

    return {
      success: true,
      message: 'Comment removed!',
    };
  },
};