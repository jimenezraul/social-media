import { gql } from '@apollo/client';

export const GOOGLE_LOGIN = gql`
  mutation googleLogin($tokenId: String!) {
    googleLogin(tokenId: $tokenId) {
      success
      message
      access_token
      user {
        given_name
        family_name
        _id
        email
        profileUrl
        isAdmin
        isVerified
      }
      isLoggedIn
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
      message
      isLoggedIn
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($userId: ID!) {
    refreshToken(id: $userId) {
      success
      message
      access_token
      user {
        _id
        given_name
        family_name
        profileUrl
        isAdmin
        isVerified
      }
      isLoggedIn
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikeAPost($postId: ID!) {
    likes(postId: $postId) {
      success
      message
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      success
      message
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($postText: String!) {
    addPost(postText: $postText) {
      _id
      postText
      postAuthor {
        _id
        fullName
        given_name
        family_name
        profileUrl
      }
      createdAtFormatted
      createdAt
      likeCount
      commentCount
      comments {
        _id
        commentText
        commentAuthor {
          _id
          fullName
          given_name
          family_name
          profileUrl
        }
      }
      likes {
        _id
        fullName
        given_name
        family_name
        profileUrl
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      success
      message
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $commentText: String!) {
    addComment(postId: $postId, commentText: $commentText) {
      _id
      commentText
      commentAuthor {
        _id
        given_name
        family_name
        profileUrl
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $givenName: String!
    $familyName: String!
    $email: String!
    $password: String!
  ) {
    register(
      given_name: $givenName
      family_name: $familyName
      email: $email
      password: $password
    ) {
      success
      message
      subMessage
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      access_token
      user {
        _id
        given_name
        family_name
        email
        profileUrl
      }
      isLoggedIn
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation Send_Friend_Request($friendId: ID!) {
    friendRequest(friendId: $friendId) {
      success
      message
    }
  }
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation Accept_Friend($friendId: ID!) {
    acceptFriendRequest(friendId: $friendId) {
      success
      message
    }
  }
`;

export const REMOVE_FRIEND = gql`
  mutation RemoveFriend($friendId: ID!) {
    removeFriend(friendId: $friendId) {
      success
      message
    }
  }
`;
