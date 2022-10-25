import { gql } from '@apollo/client';

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
