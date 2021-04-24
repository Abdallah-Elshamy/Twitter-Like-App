import { gql } from "@apollo/client";

export const Get_SFW = gql`
query @client {
  SFW {
    value
  }
}
`