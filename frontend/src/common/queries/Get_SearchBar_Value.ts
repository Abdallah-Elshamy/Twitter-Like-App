import { gql } from "@apollo/client";

export const Get_SearchBar_Value = gql`
query @client {
  searchBarValue {
    value
  }
}
`