import { gql } from "@apollo/client";

const UNRETWEET = gql`
   mutation unRetweet($tweetId: ID!){
   unRetweet(id: $tweetId)
}
`;

export default UNRETWEET;



