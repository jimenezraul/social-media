import { gql } from "@apollo/client";

export const NEW_POST_SUBSCRIPTION = gql`
  subscription New_Post_Subscription {
    newPostSubscription {
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

export const subscribeToNewPost = (subscribeToMore: any) => {
  subscribeToMore({
    document: NEW_POST_SUBSCRIPTION,
    updateQuery: (prev: any, { subscriptionData }: any) => {
      // update feed cache with new post
      if (!subscriptionData.data) return prev;
      const newPost = subscriptionData.data.newPostSubscription;
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
      const updatedFeed = prev.feed.map((post: any) => {
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

        if (post._id === newLike.postId) {
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
