import { gql } from '@apollo/client';

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
        likes {
          _id
          given_name
          family_name
          profileUrl
        }
        replies {
          _id
        }
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

export const NEW_FRIEND_REQUEST = gql`
  subscription New_Friend_Request {
    newFriendRequestSubscription {
      _id
      is_read
      message
      postId
      recipient {
        _id
        family_name
        given_name
        profileUrl
      }
      sender {
        _id
        family_name
        profileUrl
        given_name
      }
      type
    }
  }
`;

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription New_message_subscription($userId: ID!) {
    newMessageSubscription(userId: $userId) {
      _id
      members {
        _id
        given_name
        family_name
        profileUrl
      }
      messages {
        sender {
          _id
          given_name
          family_name
          profileUrl
        }
        text
        media
        createdAt
        status
      }
    }
  }
`;

export const NEW_LIKE_POST_NOTIFICATION = gql`
  subscription New_Like_Post_Notification($userId: ID!) {
    newLikePostNotificationSubscription(userId: $userId) {
      _id
      is_read
      message
      postId
      recipient {
        _id
        family_name
        given_name
        profileUrl
      }
      sender {
        _id
        family_name
        given_name
        profileUrl
      }
      type
    }
  }
`;
