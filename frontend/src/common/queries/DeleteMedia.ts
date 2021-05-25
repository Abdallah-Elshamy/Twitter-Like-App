import { gql } from "@apollo/client";

export const DeleteMedia = gql`
mutation deleteMedia ($id:String!) {
 deleteMedia(id: $id) 
}
`;




