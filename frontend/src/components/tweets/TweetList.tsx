import React, { Fragment } from "react"
import {  gql, useQuery} from '@apollo/client';
// import Tweet from '../Tweet';
import {LoggedUser} from '../../Userqery'
import Tweet from "./Tweet";
import {Tweets} from "../TweetQuery";
import { Interface } from "readline";
import {TweetData} from './Tweet'
import { parseJwt } from '../../common/decode';

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
export interface Tweets  {
    filter: string
  }

// filter (replies&tweets / likes /media )
// 

const TweetList : React.FC <Tweets> = (props) =>{
  var profile;
  if (localStorage.getItem('token') !== "LOGOUT") {
    profile = parseJwt(localStorage.getItem('token'))
  }
    console.log (props.filter)
    const {loading, error, data} = useQuery(Tweets, 
         {variables:{
            userId: profile.id, 
            filter:props.filter} 
         } ); 
    
    if (loading) return <p>'Loading .. '</p> 
    if (error) return <p>`Error! ${error.message}`</p> 
    
    return (
        
        <Fragment>
                {console.log(data.tweets.tweets) }
                {
                
                data.tweets.tweets.map((tweet:TweetData) => {
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