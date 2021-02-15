import { gql } from "@apollo/client";

export const GET_HASHTAGS = gql`
query Hashtags($page: Int){
  hashtags(page: $page){
    hashtags{
      word
      tweets(page:0){
        totalCount
      }
    }
  }
}
`