import {
  NEW_POST_SUBSCRIPTION,
  NEW_COMMENT_SUBSCRIPTION,
  NEW_FRIEND_REQUEST,
  NEW_LIKE_COMMENT_SUBSCRIPTION,
  NEW_LIKE_SUBSCRIPTION,
  NEW_MESSAGE_SUBSCRIPTION,
  NEW_LIKE_NOTIFICATION_SUBSCRIPTION,
} from './subscriptions';
import { store } from '../app/store';
import { setNewPost } from '../features/posts/postSlice';

export const subscribeToNewPost = (subscribeToMore: any) => {
  const user = store.getState().user.user;

  subscribeToMore({
    document: NEW_POST_SUBSCRIPTION,
    variables: { userId: user._id },
    updateQuery: (prev: any, { subscriptionData }: any) => {
      if (!subscriptionData.data) return prev;
      const newPost = subscriptionData.data.newPostSubscription;

      if (user._id !== newPost.postAuthor._id) {
        store.dispatch(setNewPost(true));
        return prev;
      }

      return Object.assign({}, prev, {
        feed: [newPost, ...prev.feed],
      });
    },
  });
};

export const subscribeToNewComment = (subscribeToMore: any) => {
  subscribeToMore({
    document: NEW_COMMENT_SUBSCRIPTION,

    updateQuery: (prev: any, { subscriptionData }: any) => {
      // update feed cache with new comment
      if (!subscriptionData.data) return prev;
      const newComment = subscriptionData.data.newCommentSubscription;

      if (prev.me) {
        const me = prev.me;
        if (me._id === newComment.comment.commentAuthor._id) return prev;
        const meUpdated = me.posts.map((post: any) => {
          if (post._id === newComment.postId) {
            return {
              ...post,
              comments: [...post.comments, newComment.comment],
              commentCount: post.commentCount + 1,
            };
          }
          return post;
        });
        return Object.assign({}, prev, {
          me: {
            ...me,
            posts: meUpdated,
          },
        });
      }

      if (prev.post) {
        const post = prev.post;

        const updatePost = {
          ...post,
          comments: [...post.comments, newComment.comment],
          commentCount: post.commentCount + 1,
        };

        return Object.assign({}, prev, {
          post: updatePost,
        });
      } else {
        const updatedFeed = prev.feed.map((post: any) => {
          return {
            ...post,
            comments: [...post.comments, newComment.comment],
            commentCount: post.commentCount + 1,
          };
        });
        return Object.assign({}, prev, {
          feed: [...updatedFeed],
        });
      }
    },
  });
};

export const subscribeToNewLike = (subscribeToMore: any) => {
  subscribeToMore({
    document: NEW_LIKE_SUBSCRIPTION,
    updateQuery: (prev: any, { subscriptionData }: any) => {
      if (!subscriptionData.data) return prev;
      const newLike = subscriptionData.data.newLikeSubscription;

      if (prev.post) {
        const post = prev.post;
        const updatedPost = {
          ...post,
          likes: !newLike.likeExists
            ? [...post.likes, newLike.user]
            : post.likes.filter((like: any) => like._id !== newLike.user._id),
          likeCount: !newLike.likeExists ? post.likeCount + 1 : post.likeCount - 1,
        };
        return Object.assign({}, prev, {
          post: updatedPost,
        });
      }

      // update Me cache with new like
      if (prev.me) {
        console.log("here")
        const me = prev.me;
        const updatePost = {
          ...me,
          posts: me.posts.map((post: Post) => {
            if (post._id === newLike.postId) {
              return {
                ...post,
                likes: !newLike.likeExists
                  ? [...post.likes, newLike.user]
                  : post.likes.filter((like: any) => like._id !== newLike.user._id),
                likeCount: !newLike.likeExists ? post.likeCount + 1 : post.likeCount - 1,
              };
            }
            return post;
          }),
        };

        return Object.assign({}, prev, {
          me: updatePost,
        });
      }

      // update feed cache with new like
      const updatedFeed = prev.feed.map((post: any) => {
        return {
          ...post,
          likes: !newLike.likeExists
            ? [...post.likes, newLike.user]
            : post.likes.filter((like: any) => like._id !== newLike.user._id),
          likeCount: !newLike.likeExists ? post.likeCount + 1 : post.likeCount - 1,
        };
      });

      return Object.assign({}, prev, {
        feed: [...updatedFeed],
      });
    },
  });
};

export const subscribeToNewLikeComment = (subscribeToMore: any) => {
  subscribeToMore({
    document: NEW_LIKE_COMMENT_SUBSCRIPTION,
    updateQuery: (prev: any, { subscriptionData }: any) => {
      const newLike = subscriptionData.data.newLikeCommentSubscription;
      if (!subscriptionData.data) return prev;

      // update current post object that is not an array
      if (prev.post) {
        const updatedPost = prev.post.comments.map((comment: any) => {
          if (comment._id === newLike.commentId) {
            return {
              ...comment,
              likes: !newLike.likeExists
                ? [...comment.likes, newLike.user]
                : comment.likes.filter((like: any) => like._id !== newLike.user._id),
              likesCount: !newLike.likeExists ? comment.likesCount + 1 : comment.likesCount - 1,
            };
          }
          return comment;
        });

        return Object.assign({}, prev, {
          post: {
            ...prev.post,
            comments: [...updatedPost],
          },
        });
      }
    },
  });
};

export const subscribeToFriendRequests = (subscribeToMore: any) => {
  subscribeToMore({
    document: NEW_FRIEND_REQUEST,
    updateQuery: (prev: any, { subscriptionData }: any) => {
      if (!subscriptionData.data) return prev;
      const newFriendRequest = subscriptionData.data.newFriendRequestSubscription;
      const user = store.getState().user;

      if (newFriendRequest.message === 'Removed friend request') {
        const updatedNotifications = prev.notificationsByUser.filter(
          (friendRequest: any) => friendRequest._id !== newFriendRequest._id,
        );
        return Object.assign({}, prev, {
          notificationsByUser: updatedNotifications,
        });
      }

      if (newFriendRequest.recipient._id === user.user._id) {
        return Object.assign({}, prev, {
          notificationsByUser: [newFriendRequest, ...prev.notificationsByUser],
        });
      }
      return prev;
    },
  });
};

export const subscribeToNewMessage = (subscribeToMore: any) => {
  const user = store.getState().user;
  subscribeToMore({
    document: NEW_MESSAGE_SUBSCRIPTION,
    variables: {
      userId: user.user._id,
    },
    updateQuery: (prev: any, { subscriptionData }: any) => {
      if (!subscriptionData.data) return prev;
      const newMessage = subscriptionData.data.newMessageSubscription;
      const prevMessages = prev.me.messages;

      const updatedMessages = prevMessages.filter((message: any) => message._id !== newMessage._id);
      const newArray = [newMessage, ...updatedMessages];

      return Object.assign({}, prev, {
        me: {
          ...prev.me,
          messages: newArray,
        },
      });
    },
  });
};

export const subscribeToNewLikeNotification = (subscribeToMore: any) => {
  const user = store.getState().user;
  subscribeToMore({
    document: NEW_LIKE_NOTIFICATION_SUBSCRIPTION,
    variables: {
      userId: user.user._id,
    },
    updateQuery: (prev: any, { subscriptionData }: any) => {
      if (!subscriptionData.data) return prev;
      const newLikeNotification = subscriptionData.data.newLikeNotificationSubscription;

      if (newLikeNotification.message === 'Removed like notification') {
        const updatedNotifications = prev.notificationsByUser.filter(
          (likeNotification: any) => likeNotification._id !== newLikeNotification._id,
        );
        return Object.assign({}, prev, {
          notificationsByUser: updatedNotifications,
        });
      }

      if (newLikeNotification.recipient._id === user.user._id) {
        return Object.assign({}, prev, {
          notificationsByUser: [newLikeNotification, ...prev.notificationsByUser],
        });
      }
      return prev;
    },
  });
};
