import { gql } from "@apollo/client";

import { store } from "../app/store";
import { setNotifications } from "../features/users/userSlice";
import { setNewPost } from "../features/posts/postSlice";

export const NEW_POST_SUBSCRIPTION = gql`
  subscription New_Post_Subscription($userId: ID!) {
    newPostSubscription(userId: $userId) {
      postText
      _id
      likeCount
      commentCount
      createdAtFormatted
      postAuthor {
        given_name
        family_name
        email
        profileUrl
        isAdmin
        isVerified
        _id
        fullName
        friends {
          _id
          fullName
        }
      }
      comments {
        _id
        commentText
        commentAuthor {
          _id
          fullName
          createdAtFormatted
        }
      }
      likes {
        _id
        fullName
        profileUrl
      }
    }
  }
`;

export const NEW_COMMENT_SUBSCRIPTION = gql`
  subscription NewCommentSubscription {
    newCommentSubscription {
      postId
      comment {
        _id
        commentText
        commentAuthor {
          fullName
          profileUrl
          _id
          createdAtFormatted
        }
        createdAt
        createdAtFormatted
        likesCount
      }
    }
  }
`;

export const NEW_LIKE_SUBSCRIPTION = gql`
  subscription New_Like_Subscription {
    newLikeSubscription {
      postId
      likeExists
      user {
        _id
        fullName
        profileUrl
      }
    }
  }
`;

export const NEW_LIKE_COMMENT_SUBSCRIPTION = gql`
  subscription Subscription {
    newLikeCommentSubscription {
      commentId
      likeExists
      user {
        _id
        given_name
        family_name
        profileUrl
        fullName
      }
    }
  }
`;

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

      const updatedFeed = prev.feed.map((post: any) => {
        const data = {
          type: "comment",
          postId: newComment.postId,
          message: `${newComment.comment.commentAuthor.fullName} commented on your post`,
          user: newComment.comment.commentAuthor,
          post: {
            ...newComment.comment,
            postText: newComment.comment.commentText,
          },
        };
        if (
          post.postAuthor._id === user._id &&
          newComment.comment.commentAuthor._id !== user._id
        ) {
          store.dispatch(setNotifications([...state.notifications, data]));
          localStorage.setItem(
            "notifications",
            JSON.stringify([...state.notifications, data])
          );
        }

        return {
          ...post,
          comments: [newComment.comment, ...post.comments],
          commentCount: post.commentCount + 1,
        };
      });

      return Object.assign({}, prev, {
        feed: [...updatedFeed],
      });
    },
  });
};

export const subscribeToNewLike = (subscribeToMore: any) => {
  subscribeToMore({
    document: NEW_LIKE_SUBSCRIPTION,
    updateQuery: (prev: any, { subscriptionData }: any) => {
      // update feed cache with new like
      if (!subscriptionData.data) return prev;
      const newLike = subscriptionData.data.newLikeSubscription;
      const updatedFeed = prev.feed.map((post: any) => {
        const user = JSON.parse(localStorage.getItem("user")!) || {};
        const notifications =
          JSON.parse(localStorage.getItem("notifications")!) || [];
        if (post._id === newLike.postId) {
          if (!newLike.likeExists) {
            if (
              user._id === post.postAuthor._id &&
              post.postAuthor._id !== newLike.user._id
            ) {
              const data = {
                type: "like",
                postId: post._id,
                message: `${newLike.user.fullName} liked your post.`,
                user: newLike.user,
                post: post,
              };

              if (notifications.length > 0) {
                const notificationExists = notifications.find(
                  (notification: any) =>
                    notification.user._id === newLike.user._id &&
                    notification.type === "like" &&
                    notification.postId === post._id
                );
                if (!notificationExists) {
                  notifications.push(data);
                  localStorage.setItem(
                    "notifications",
                    JSON.stringify(notifications)
                  );
                  store.dispatch(setNotifications(notifications));
                }
              } else {
                localStorage.setItem("notifications", JSON.stringify([data]));
                store.dispatch(setNotifications([data]));
              }
            }
          } else {
            if (
              user._id === post.postAuthor._id &&
              post.postAuthor._id !== newLike.user._id
            ) {
              const data = notifications.filter(
                (notification: any) =>
                  notification.user._id !== user._id &&
                  notification.type !== "like"
              );

              localStorage.setItem("notifications", JSON.stringify(data));
              store.dispatch(setNotifications(data));
            }
          }

          return {
            ...post,
            likes: !newLike.likeExists
              ? [...post.likes, newLike.user]
              : post.likes.filter((like: any) => like._id !== newLike.user._id),
            likeCount: !newLike.likeExists
              ? post.likeCount + 1
              : post.likeCount - 1,
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
                : comment.likes.filter(
                    (like: any) => like._id !== newLike.user._id
                  ),
              likesCount: !newLike.likeExists
                ? comment.likesCount + 1
                : comment.likesCount - 1,
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
