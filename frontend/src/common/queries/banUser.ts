import { gql } from "@apollo/client";

const BanUser = gql`
    mutation banUser($userId: ID!) {
        banUser(userId: $userId)
    }
`;

export default BanUser;