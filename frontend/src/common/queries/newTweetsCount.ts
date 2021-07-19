import { gql } from "@apollo/client";

const NewTweetsCount = gql`
query @client {
  NewTweetsCount {
    value
  }
}
`
export default NewTweetsCount;