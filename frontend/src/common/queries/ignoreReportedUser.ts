import { gql } from "@apollo/client";

const IgnoreReportedUser = gql`
    mutation ignoreReportedUser($userId: ID!) {
        ignoreReportedUser(userId: $userId)
    }
`;

export default IgnoreReportedUser;