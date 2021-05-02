import React from 'react'
import './tweet.css';

import { useHistory } from 'react-router';
import Tweet_info from './Tweet_Info';
import Tweet_img from './Tweet_img';
import Tweet_toolbarIcons from './Tweet_toolbarIcons';
import QuotedTweet from './QoutedTweet';


function Tweet(props: any) {
  
  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + props.id,
    })
  }

  switch( props.state) {
    
    case "O":
      return <div>  
      <div className="tweet-box mt-2" onClick={e => { goToTweet(); e.stopPropagation() }} >
       <Tweet_img imageURL={props.user.imageURL}  id={props.user?.id} className ="tweet-icon "/>   

      <div className="tweet-aside -ml-2">
        <Tweet_info
          userName={props.user?.userName}
          createdAt={props.createdAt}
          name={props.user?.name}
          id={props.user.id}
        />
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
  
  <hr />
  </div>

    case "C":
      return <div>

      <div className="tweet-box mt-2" onClick={e => { goToTweet(); e.stopPropagation() }} >
        <Tweet_img imageURL={props.user.imageURL} className ="tweet-icon"/>
        <div className="tweet-aside -ml-2">
          <Tweet_info
            id = {props.user?.id}
            userName={props.user?.userName}
            createdAt={props.createdAt}
            name={props.user?.name}
            className = " -mt-1"
          />
          {/* the added design of Reply design  */}
          <div className="space-x-2 -mt-3 -ml-12"> 
            <p className=" p--light-color mt-2 ml-12 inline-block"> Repling to </p>
            <a className ="text-blue-500 inline-block hover:underline"> @{props.repliedToTweet.user?.name}</a>
          </div>
  
         {/* the text/media of the original tweet */}
          <div className="tweet-content pb-4 pt-2">        
            <span>
              {props.text}
            </span>
  
          </div>
        </div>
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
    

    case "Q":
      return <div>
      {/* the design of tweet */}
      <div className="flex p-2" onClick={goToTweet} >
        <Tweet_img imageURL={props.user.imageURL} id={props.user?.id} className="tweet-icon " />

        <div className="w-full">
          <Tweet_info
            userName={props.user?.userName}
            createdAt={props.createdAt}
            name={props.user?.name}
            id={props.user.id}
          />

          {/* the text/media of the original tweet */}
          <div className="tweet-content ml-2">
            <span>
              {props.text}
            </span>
            <QuotedTweet OTweet = {props.originalTweet}  repliedToTweet = {props.repliedToTweet}/> 
            <Tweet_toolbarIcons
              repliesCount={props.repliesCount}
              likesCount={props.likesCount}
              quotedRetweetsCount={props.quotedRetweetsCount}
              retweetsCount={props.retweetsCount}
            />

          </div>
        </div>
      </div>
      {/* the end of tweet */}


      <hr />
    </div>
    default:
      return <div>
 </div>   
  }

}

export default Tweet;