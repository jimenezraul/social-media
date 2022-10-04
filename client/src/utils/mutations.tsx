import { gql } from "@apollo/client";

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
