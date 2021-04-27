import { gql } from "@apollo/client";

export const GetEditProfileImage = gql`
query @client {
  EditProfileImage{
   Image,
   ImageURL
  }
}
`
