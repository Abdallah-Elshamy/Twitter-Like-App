import React, { Fragment } from 'react';
import '../../styles/layout.css'
import Tweet from './Tweet';
import { TweetData } from './TweetData_interface'
import { useQuery } from '@apollo/client';
import { GET_SINGLE_TWEET } from './../../common/queries/GET_SINGLE_TWEET';
import { Get_SFW } from './../../common/queries/GET_SFW';
import Loading from './../../UI/Loading';
import FoF from './../../UI/FoF/FoF';
import { parseJwt } from "../../common/decode";



const Retweet: React.FC<any> = (props: any) => {

  const sfw = useQuery(Get_SFW).data;
  const loggedUser = parseJwt(localStorage.getItem('token')!)

  const { data, loading, error } = useQuery(GET_SINGLE_TWEET, {
    variables: {
      tweetId: props.id,
      isSFW: sfw.SFW.value,
    }
  })
  if (loading) return (<div className="mt-8" ><Loading /></div>)
  if (error) return <FoF
    msg="This tweet doesn’t exist"
  />
  const tweet: TweetData = data.tweet
  return (
    <Fragment>
      <Tweet
        mediaURLs={tweet.mediaURLs}
        id={tweet.id}
        text={tweet.text}
        repliesCount={tweet.repliesCount}
        createdAt={tweet.createdAt}
        isLiked={tweet.isLiked}
        isRetweeted={tweet.isRetweeted}
        user={tweet.user}
        loggedUser={loggedUser}
        tweet={tweet}
        likesCount={tweet.likesCount}
        quotedRetweetsCount={tweet.quotedRetweetsCount}
        retweetsCount={tweet.retweetsCount}
        state={tweet.state}
        originalTweet={tweet.originalTweet}
        repliedToTweet={tweet.repliedToTweet}
      />
    </Fragment>
  );
}

export default Retweet;