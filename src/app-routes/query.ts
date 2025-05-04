import { gql } from "@apollo/client";

const GET_AUTH_USER = gql`
  query GetAuthUser {
    getAuthUser {
      email
      gender
      id
      languages
      fcmToken
      mobile
      name
    }
  }
`;

export { GET_AUTH_USER };
