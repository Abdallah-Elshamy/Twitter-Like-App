import { gql } from "@apollo/client";

const IgnoreReportedTweet = gql`
    mutation ignoreReportedTweet($id: ID!) {
        ignoreReportedTweet(id: $id)
    }
`;

export default IgnoreReportedTweet;