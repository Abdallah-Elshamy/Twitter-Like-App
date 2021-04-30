//design of tweet with retweet

import React from 'react'
import './tweet.css';

import { useHistory } from 'react-router';
import Tweet_info from './Tweet_Info';
import Tweet_img from './Tweet_img';
import Tweet_toolbarIcons from './Tweet_toolbarIcons';

export interface TweetData {
  user?: {
    imageURL?: string
    name?: string
    userName?: string
  }
  id?: string
  text: string
  likesCount?: number
  repliesCount?: number
  retweetsCount?:number
  quotedRetweetsCount?:number
  createdAt?: number
  isLiked?: boolean
}

function Tweet(props: any) {
  
  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + props.id,
    })
  }

return (
    <div >


{/* the design of tweet */}
<div className="tweet-box mt-2" onClick={goToTweet} >
<Tweet_img imageURL={props.user.imageURL}  id={props.user?.id} className ="tweet-icon"/>   

      <div className="tweet-aside">
        <Tweet_info
          userName={props.user?.userName}
          createdAt={props.createdAt}
          name={props.user?.name}
          id={props.user.id}
        />

 {/* the text/media of the original tweet */}
        <div className="tweet-content">        
          <span>
            {props.text}
          </span>

        <Tweet_toolbarIcons 
          repliesCount  = {props.repliesCount}
          likesCount    = {props.likesCount}
          quotedRetweetsCount = {props.quotedRetweetsCount}
          retweetsCount = {props.retweetsCount}

        />

        </div>
      </div>
    </div>
{/* the end of tweet */}

  
<hr />
   </div>
  
  )
}

export default Tweet;