import { gql } from "@apollo/client";

const ReportTweet = gql`
    mutation reportTweet($id: ID!) {
        reportTweet(id: $id)
    }
`;

export default ReportTweet;