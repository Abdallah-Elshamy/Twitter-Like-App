import { gql } from "@apollo/client";

export const ReportedUsers = gql`
    query reportedUsers($page: Int) {
        reportedUsers(page: $page) {
            users {
                id
                isFollowing
                name
                userName
                imageURL
                bio
                isBanned
            }
            totalCount
        }
    }
`;
export default ReportedUsers;
