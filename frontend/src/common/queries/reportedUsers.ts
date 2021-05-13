import { gql } from "@apollo/client";

export const ReportedUsers = gql`
    query reportedUsers($page: Int) {
        reportedUsers(page: $page) {
            users {
                id
                isFollowing
                name
                username: userName
                imageURI: imageURL
                bio
            }
            totalCount
        }
    }
`;
export default ReportedUsers;
