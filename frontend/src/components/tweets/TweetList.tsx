import React, { Fragment } from "react"
import { useQuery } from '@apollo/client';
// import Tweet from '../Tweet';
import Tweet from "./Tweet";
import { Tweets } from "../../common/queries/TweetQuery";
import { TweetData } from './Tweet'
import { parseJwt } from '../../common/decode';
import { Get_SFW } from "../../common/queries/GET_SFW";

export interface TweetFilter {
  filter: string
}

const TweetList: React.FC<TweetFilter> = (props) => {
  var profile;
  if (localStorage.getItem('token') !== null) {
    profile = parseJwt(localStorage.getItem('token'))
  }
  const sfw = useQuery(Get_SFW).data
  const { loading, error, data } = useQuery(Tweets,
    {
      variables: {
        userId: profile.id,
        filter: props.filter,
        isSFW: sfw.SFW.value
      }
    });

  if (loading) return <p>'Loading .. '</p>
  if (error) return <p>`Error! ${error.message}`</p>

  return (

    <Fragment>
      {console.log(data.tweets.tweets)}
      {

        data.tweets.tweets.map((tweet: TweetData) => {
          return <Tweet text={tweet.text}
            repliesCount={tweet.repliesCount}
            createdAt={tweet.createdAt}
            isLiked={tweet.isLiked}
            user={tweet.user}
            likesCount={tweet.likesCount}
            key={tweet.id} />
        })}
    </Fragment>
  )
}


export default TweetList;