const { AuthenticationError } = require('apollo-server-express');
const { Post } = require('../../models');

module.exports = {
  likes: async (parent, { postId }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new AuthenticationError('You need to be logged in!');
    }

    const post = await Post.findOne({ _id: postId });

    const likeExists = post.likes.includes(context.user._id);

    await Post.findOneAndUpdate(
      { _id: postId },
      likeExists
        ? { $pull: { likes: context.user._id } }
        : { $push: { likes: context.user._id } },
      {
        new: true,
      }
    );

    return {
      success: true,
      message: likeExists ? 'Like removed!' : 'Like added!',
    };
  },
};