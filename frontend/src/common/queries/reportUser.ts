import { gql } from "@apollo/client";

const ReportUser = gql`
    mutation reportUser($userId: ID!) {
        reportUser(userId: $userId)
    }
`;

export default ReportUser;