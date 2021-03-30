import { gql } from "@apollo/client";

export const ADD_USER = gql`
mutation createUser ($userInput: UserCreateInput!) {
  createUser(userInput : $userInput) {
    name
    userName
    id
    email
    bio
    createdAt 
  }
}
`;


