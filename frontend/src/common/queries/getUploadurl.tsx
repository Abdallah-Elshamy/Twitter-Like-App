import { gql } from "@apollo/client";

export const getUploadURL = gql`
query getUploadURL ($isVideo:Boolean) {
  getUploadURL(isVideo: $isVideo ) 
}
`