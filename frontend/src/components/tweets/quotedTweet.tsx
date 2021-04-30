//design of quoted retweet


import React from 'react'
import './tweet.css';
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

function QuotedTweet(props: any) {
  return (
    <div>

    <div className="tweet-box mt-2" >
      <Tweet_img imageURL={props.user.imageURL} className ="tweet-icon"/>

      <div className="tweet-aside">
        <Tweet_info
          userName={props.user?.userName}
          createdAt={props.createdAt}
          name={props.user?.name}
        />

 {/* the text/media of the original tweet */}
        <div className="tweet-content pb-4 pt-2">        
          <span>
            {props.text}
          </span>

        </div>
      </div>
   
    </div>
<div className="box-border border-2 rounded-lg mt-1 pt-2 ml-20 mr-8" >
  
{/* the tweet */}
<div className="tweet-box py-1" >
      <Tweet_img imageURL={props.user.imageURL} className="tweet-small-icon -mr-8" />

      <div className="tweet-aside">
        <Tweet_info
        className = "-ml-4"
          userName={props.user?.userName}
          createdAt={props.createdAt}
          name={props.user?.name}
        />

 {/* the text/media of the original tweet */}
        <div className="tweet-content pb-4 pt-2">        
          <span>
            {props.text}
          </span>
        </div>
      </div>
   
    </div>
{/* the end of tweet */}

</div>

<div className = "ml-16">
<Tweet_toolbarIcons 
    repliesCount  = {props.repliesCount}
    likesCount    = {props.likesCount}
    quotedRetweetsCount = {props.quotedRetweetsCount}
    retweetsCount = {props.retweetsCount}
  />

</div>
<hr/>
   </div>
  
  )
}

export default QuotedTweet;