import { gql } from "@apollo/client";

const SetMessageSeen = gql`
    mutation ($messageId: ID!) {
        setMessageSeen(messageId: $messageId)
    }
`;

export default SetMessageSeen;
