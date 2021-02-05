import React, { Fragment } from "react"
import {  gql, useQuery} from '@apollo/client';
// import Tweet from '../Tweet';
import {LoggedUser} from '../Userqery'
import Tweet from "./Tweet";

const Tweets = gql `
query tweets  {
    tweets (userId:1) { 
      totalCount
      tweets{
        id
        text 
        likesCount
        repliesCount
        createdAt
        isLiked
      }
    }}
`
interface tweetList {
    
}
function TweetList (){
    const {loading, error, data} = useQuery(Tweets);  
    if (loading) return <p>'Loading .. '</p> 
    if (error) return <p>`Error! ${error.message}`</p> 
    const tweetList = data.tweets.tweets.map((tweet:any) => {
        return <Tweet tweet={tweet} key={tweet.id} />
    });
    return (
        <Fragment>
                {tweetList}
        </Fragment>
    )
}


export default TweetList ; 