import { gql } from "@apollo/client";

export const GetEditBgImage = gql`
query @client {
  EditProfileBg{
   BgImage,
   BgImageURL
  }
}
`