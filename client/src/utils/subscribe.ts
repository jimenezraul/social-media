import {
  NEW_POST_SUBSCRIPTION,
  NEW_COMMENT_SUBSCRIPTION,
  NEW_FRIEND_REQUEST,
  NEW_LIKE_COMMENT_SUBSCRIPTION,
  NEW_LIKE_SUBSCRIPTION,
} from './subscriptions';
import { store } from '../app/store';
import { setNewPost } from '../features/posts/postSlice';
import { setNewNotifications, setNewNotification } from './notification';

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
      const state = store.getState().user;
      const user = state.user;

      const data = {
        type: 'comment',
        postId: newComment.postId,
        message: `${newComment.comment.commentAuthor.fullName} commented on your post`,
        user: newComment.comment.commentAuthor,
        post: {
          ...newComment.comment,
          postText: newComment.comment.commentText,
        },
      };

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
        if (post.postAuthor._id === user._id && newComment.comment.commentAuthor._id !== user._id) {
          setNewNotifications(state.notifications, data);
        }

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
          if (
            post.postAuthor._id === user._id &&
            newComment.comment.commentAuthor._id !== user._id
          ) {
            setNewNotifications(state.notifications, data);
          }

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
        const user = prev.me;
        const updatePost = {
          ...user,
          posts: user.posts.map((post: Post) => {
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
        const user = JSON.parse(localStorage.getItem('user')!) || {};
        const notifications = JSON.parse(localStorage.getItem('notifications')!) || [];
        if (post._id === newLike.postId) {
          if (!newLike.likeExists) {
            if (user._id === post.postAuthor._id && post.postAuthor._id !== newLike.user._id) {
              const data = {
                type: 'like',
                postId: post._id,
                message: `${newLike.user.fullName} liked your post.`,
                user: newLike.user,
                post: post,
              };

              if (notifications.length > 0) {
                const notificationExists = notifications.find(
                  (notification: any) =>
                    notification.user._id === newLike.user._id &&
                    notification.type === 'like' &&
                    notification.postId === post._id,
                );
                if (!notificationExists) {
                  notifications.push(data);
                  setNewNotification(notifications);
                }
              } else {
                setNewNotification([data]);
              }
            }
          } else {
            if (user._id === post.postAuthor._id && post.postAuthor._id !== newLike.user._id) {
              const data = notifications.filter(
                (notification: any) =>
                  notification.user._id !== newLike.user._id && notification.type === 'like',
              );
              setNewNotification(data);
            }
          }

          return {
            ...post,
            likes: !newLike.likeExists
              ? [...post.likes, newLike.user]
              : post.likes.filter((like: any) => like._id !== newLike.user._id),
            likeCount: !newLike.likeExists ? post.likeCount + 1 : post.likeCount - 1,
          };
        }
        return post;
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

      const data = {
        type: 'friendRequest',
        postId: newFriendRequest.friendId,
        message: `${newFriendRequest.user.fullName} sent you a friend request`,
        user: newFriendRequest.user,
        post: {
          _id: newFriendRequest.friendId,
        },
      };

      if (newFriendRequest.friendId === user.user._id && newFriendRequest.requestExists) {
        setNewNotifications(user.notifications, data);
      } else {
        const filteredNotifications = user.notifications.filter(
          (notification: any) => notification.post._id !== newFriendRequest.friendId,
        );
        setNewNotification(filteredNotifications);
      }

      return prev;
    },
  });
};
