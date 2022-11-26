const { GraphQLError } = require('graphql');
const { Post, User, Comment, Notification } = require('../../models');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  likes: async (parent, { postId }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
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

    pubsub.publish('NEW_LIKE', {
      newLikeSubscription: {
        postId: postId,
        likeExists: likeExists,
        user: currentUser,
      },
    });

    if (likeExists && post.postAuthor._id !== context.user._id) {
      const noti = await Notification.findOneAndDelete({
        sender: context.user._id,
        postId: postId,
        type: 'LIKE',
      });
      
      currentUser.notifications.pull(noti._id);
      currentUser.save();
    } else if (post.postAuthor._id != context.user._id) {
      const noti = await Notification.create({
        sender: context.user._id,
        recipient: post.postAuthor._id,
        type: 'LIKE',
        postId: postId,
        message: `${currentUser.given_name} ${currentUser.family_name} liked your post`,
      });

      currentUser.notifications.push(noti._id);
      currentUser.save();
    }

    return {
      success: true,
      message: likeExists ? 'Like removed!' : 'Like added!',
    };
  },

  likeComment: async (parent, { commentId }, context) => {
    const loggedUser = context.user;

    if (!loggedUser) {
      throw new GraphQLError('You need to be logged in!', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const comment = await Comment.findOne({ _id: commentId });

    const likeExists = comment.likes.includes(context.user._id);

    await Comment.findOneAndUpdate(
      { _id: commentId },
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

    pubsub.publish('NEW_LIKE_COMMENT', {
      newLikeCommentSubscription: {
        commentId: commentId,
        likeExists: likeExists,
        user: currentUser,
      },
    });

    return {
      success: true,
      message: likeExists ? 'Like removed!' : 'Like added!',
    };
  },

  newLikeSubscription: {
    subscribe: () => pubsub.asyncIterator(['NEW_LIKE']),
  },
  newLikeNotificationSubscription: {
    subscribe: pubsub.asyncIterator('NEW_LIKE_NOTIFICATION'),
  },

  newLikeCommentSubscription: {
    subscribe: () => pubsub.asyncIterator(['NEW_LIKE_COMMENT']),
  },
};
