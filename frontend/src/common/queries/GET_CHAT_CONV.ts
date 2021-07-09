import { gql } from "@apollo/client";

export const GET_CHAT_CONV = gql`
query getConversationHistory($page:Int){
  getConversationHistory(page:$page){
      totalCount
        conversations{
            with{
                id
                name
                userName
                imageURL
            }
            unseenMessageCount
            lastMessage{
                message
                createdAt
            }
        }
  }
}
`