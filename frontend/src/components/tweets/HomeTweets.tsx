import React, { Fragment } from "react"
import { useQuery } from '@apollo/client';
import Tweet from "./Tweet";
import {TweetData} from './Tweet'
import {FeedTweets} from '../../common/queries/Feedtweets'
import Loading from '../../UI/Loading'

function HomeTweets() {

    const {loading, error, data} = useQuery(FeedTweets); 
    
    if (loading) return <Loading/>
    if (error) return <p>`Error! this is the one ${error.message}`</p> 
    
    return (

        <Fragment>
                {console.log(data) }
                {
                
                data.getFeed.map((tweet:TweetData) => {
                  console.log (`tweet is ${tweet}`)
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


export default HomeTweets;