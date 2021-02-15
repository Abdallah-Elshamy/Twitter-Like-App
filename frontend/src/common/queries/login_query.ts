  import { gql } from "@apollo/client";

 export const LOGIN = gql`
query login($userNameOrEmail: String!, $password: String!) {
    login(userNameOrEmail: $userNameOrEmail, password: $password)  {
      token
    }
  }
`