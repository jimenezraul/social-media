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
