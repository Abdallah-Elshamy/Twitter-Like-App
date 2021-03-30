import { gql } from "@apollo/client";

export const Get_Logged_user = gql`
query @client {
  logUser {
    user
  }
}
`