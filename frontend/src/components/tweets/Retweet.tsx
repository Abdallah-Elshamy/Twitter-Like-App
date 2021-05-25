import React, { Fragment } from 'react';
import '../../styles/layout.css'
import Tweet from './Tweet';
import { TweetData } from './TweetData_interface'
import { useQuery } from '@apollo/client';
import { GET_SINGLE_TWEET } from './../../common/queries/GET_SINGLE_TWEET';
import { Get_SFW } from './../../common/queries/GET_SFW';
import Loading from './../../UI/Loading';
import FoF from './../../UI/FoF/FoF';


const Retweet: React.FC<any> = (props: any) => {

  const sfw = useQuery(Get_SFW).data;

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
        id={tweet.id}
        text={tweet.text}
        repliesCount={tweet.repliesCount}
        createdAt={tweet.createdAt}
        isLiked={tweet.isLiked}
        user={tweet.user}
        likesCount={tweet.likesCount}
        quotedRetweetsCount={tweet.quotedRetweetsCount}
        retweetsCount={tweet.retweetsCount}
        isRetweeted={tweet.isRetweeted}
        state={tweet.state}
        originalTweet={tweet.originalTweet}
        repliedToTweet={tweet.repliedToTweet}
      />
    </Fragment>
  );
}

export default Retweet;