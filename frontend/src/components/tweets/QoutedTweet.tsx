//design of quoted retweet


import React from 'react'
import './tweet.css';
import Tweet_info from './Tweet_Info';
import Tweet_img from './Tweet_img';
import Tweet_toolbarIcons from './Tweet_toolbarIcons';
import Tweet_Info from './Tweet_Info';


function QuotedTweet(props: any) {
  return (

    <div className="tweet-box py-1" >
      <Tweet_img imageURL={props.user.imageURL} className="tweet-small-icon -mr-8" />

      <div className="tweet-aside">
        <Tweet_Info
          className="-ml-4"
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

  )
}
export default QuotedTweet;