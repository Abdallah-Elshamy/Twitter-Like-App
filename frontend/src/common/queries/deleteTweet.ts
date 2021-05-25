import { gql } from "@apollo/client";

const deleteTweet = gql`
    mutation deleteTweet($id: ID!) {
        deleteTweet(id: $id)
    }
`;

export default deleteTweet;