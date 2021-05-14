import { gql } from "@apollo/client";

const UnBanUser = gql`
    mutation unBanUser($userId: ID!) {
        unBanUser(userId: $userId)
    }
`;

export default UnBanUser;