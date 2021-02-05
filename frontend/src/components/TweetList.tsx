import React, { Fragment } from "react"
import {  gql, useQuery} from '@apollo/client';
// import Tweet from '../Tweet';
import {LoggedUser} from '../Userqery'
import Tweet from "./Tweet";
import {Tweets} from "./TweetQuery";
import { Interface } from "readline";
import {TweetData} from './Tweet'
// interface TweetData {
//   user :{
//     imageURL:string
//     name:string
//     userName:string
//   }
//   id:number
//   text :string
//   likesCount :boolean
//   repliesCount:number
//   createdAt:number
//   isLiked:boolean
// }
// interface Tweets  {
//     totalCount:number
//     tweets :[]
//   }


function TweetList (){
    const {loading, error, data} = useQuery(Tweets); 
    console.log(data) 
    if (loading) return <p>'Loading .. '</p> 
    if (error) return <p>`Error! ${error.message}`</p> 
    
    return (
        <Fragment>
                
                { data.tweets.tweets.map((tweet:TweetData) => {
                  console.log (tweet)
                return <Tweet text={tweet.text}
                repliesCount={tweet.repliesCount}
                createdAt={tweet.createdAt}
                isLiked={tweet.isLiked}
                user = {tweet.user}
                likesCount = {tweet.likesCount}
                key={tweet.id} />
    })}
        </Fragment>
    )
}


export default TweetList ; 