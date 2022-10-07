import { gql } from "@apollo/client";

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


