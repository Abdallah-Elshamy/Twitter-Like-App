import { gql } from "@apollo/client";

const ALL_SEEN = gql`
    mutation allSeen($userId: ID!) {
        setAllMessagesFromUserSeen(userId: $userId)
    }
`;

export default ALL_SEEN;