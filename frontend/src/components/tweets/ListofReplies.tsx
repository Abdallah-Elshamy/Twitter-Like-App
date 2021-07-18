import React, { useState } from 'react';
import '../../styles/layout.css'
import TweetListForSingleTweet from "./TweetListForSingleTweet"

const Replies: React.FC<any> = (props: any) => {
  const [page, setPage] = useState<any>(1);
  return (
    <TweetListForSingleTweet
    page={page}
    setPage={setPage}
    queryName="GET_TWEET_REPLIES"
    id = {props.id}
/>
  );
}

export default Replies;