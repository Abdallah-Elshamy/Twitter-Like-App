import { gql } from "@apollo/client";

const AllUnseenMessagesCount = gql`
query {
  getUnseenMessages{
    totalCount
  }
}
`

export default AllUnseenMessagesCount;