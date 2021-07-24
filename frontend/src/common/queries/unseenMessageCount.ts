import { gql } from "@apollo/client";

const UnseenMessageCount = gql`
    query getUnseenMessageCount($userId: ID!) {
        getUnseenMessagesCountFromUser(userId: $userId)
    }
`;
export default UnseenMessageCount;
