import { gql } from "@apollo/client";

export const GET_ISAUTH = gql`
query @client {
 authenticated
}
`