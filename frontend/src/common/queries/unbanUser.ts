import { gql } from "@apollo/client";

const UnbanUser = gql`
    mutation unbanUser($userId: ID!) {
        unbanUser(userId: $userId)
    }
`;

export default UnbanUser;