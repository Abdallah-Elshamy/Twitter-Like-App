import { gql } from "@apollo/client";

export const EditUser = gql`
mutation EditUser ($userInput:UserUpdateInput!) {
 updateUser(userInput: $userInput) {
   id,
   imageURL,
   coverImageURL,
   name,
   birthDate,
   bio
 }
}
`;