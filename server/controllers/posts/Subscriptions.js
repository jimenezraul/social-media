const { withFilter } = require('graphql-subscriptions');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  newPostSubscription: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('NEW_POST'),
      (payload, variables, context) => {
        return context.user.friends.includes(
          payload.newPostSubscription.postAuthor._id.toString()
        );
      }
    ),
  },
  newLikeSubscription: {
    subscribe: () => pubsub.asyncIterator(['NEW_LIKE']),
  },
  newCommentSubscription: {
    subscribe: () => pubsub.asyncIterator(['NEW_COMMENT']),
  },
};
