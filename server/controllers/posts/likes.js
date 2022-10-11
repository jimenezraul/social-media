const { AuthenticationError } = require('apollo-server-express');
const { Post, User } = require('../../models');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

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

    const currentUser = await User.findOne({
      _id: context.user._id,
    }).select('-__v -password');
  
    pubsub.publish('NEW_LIKE', { newLikeSubscription: {
      postId: postId,
      likeExists: likeExists,
      user: currentUser,
    } });

    return {
      success: true,
      message: likeExists ? 'Like removed!' : 'Like added!',
    };
  },

  newLikeSubscription: {
    subscribe: () => pubsub.asyncIterator(['NEW_LIKE']),
  },
};
