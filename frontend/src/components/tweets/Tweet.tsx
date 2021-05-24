import React, { Fragment } from 'react'
import './tweet.css';

import { useHistory } from 'react-router';
import TweetInfo from './TweetInfo';
import TweetImg from './TweetImg';
import TweetToolbarIcons from './TweetToolbarIcons';
import QuotedTweet from './QoutedTweet';
import { Link } from 'react-router-dom';
import FoF from '../../UI/FoF/FoF';
import Retweet from './Retweet';


function Tweet(props: any) {

  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + props.id,
    })
  }

  const goToProfile = () => {
    history.replace({
      pathname: '/' + props.user.id,

    })
  }
  switch (props.state) {

    case "O":
      return <div>
        <div className="tweet-box mt-2" onClick={e => { goToTweet(); e.stopPropagation() }} >
          <TweetImg imageURL={props.user.imageURL} id={props.user?.id} className="tweet-icon " />

          <div className="tweet-aside ">
            <TweetInfo
              userName={props.user?.userName}
              createdAt={props.createdAt}
              name={props.user?.name}
              id={props.user.id}
              userId={props.user.id}
              tweetId={props.id}
              loggedUser={props.loggedUser}
              tweetMediaUrls={props.mediaUrls}
              tweet={props.tweet}
            />

            <div className="tweet-content ml-2">
              <span>
                {props.text}
              </span>

              <TweetToolbarIcons
                repliesCount={props.repliesCount}
                likesCount={props.likesCount}
                quotedRetweetsCount={props.quotedRetweetsCount}
                retweetsCount={props.retweetsCount}
                tweetId={props.id}
              />
            </div>
          </div>
        </div>

        <hr />
      </div>

    case "C":
      return <div>

        <div className="tweet-box mt-2 flex w-full p-2" onClick={e => { goToTweet(); e.stopPropagation() }} >
          <TweetImg imageURL={props.user.imageURL} className="tweet-icon block " />
          <div className="tweet-aside ">
            <TweetInfo
              userName={props.user?.userName}
              createdAt={props.createdAt}
              name={props.user?.name}
              id={props.user.id}
              userId={props.user.id}
              tweetId={props.id}
              loggedUser={props.loggedUser}
              tweetMediaUrls={props.mediaUrls}
              tweet={props.tweet}
            />
            {/* the added design of Reply design  */}
            <div className="-mt-2 ">
              <p className=" p--light-color inline-block ml-2"> Repling to </p>
              <Link onClick={e => { e.stopPropagation() }}
                to={'/' + props.repliedToTweet.user.id}
                className="text-blue-500 inline-block hover:underline">
                @{props.repliedToTweet.user?.userName}</Link>
            </div>

            {/* the text/media of the original tweet */}
            <div className="tweet-content ml-2 pb-4">
              <span>
                {props.text}
              </span>
              <TweetToolbarIcons
                repliesCount={props.repliesCount}
                likesCount={props.likesCount}
                quotedRetweetsCount={props.quotedRetweetsCount}
                retweetsCount={props.retweetsCount}
                tweetId={props.id}
              />

            </div>
          </div>
        </div>


        <hr />
      </div>


    case "Q":
      return <div>
        {/* the design of tweet */}
        <div className="flex p-2" onClick={goToTweet} >
          <TweetImg imageURL={props.user.imageURL} id={props.user?.id} className="tweet-icon " />

          <div className="w-full">
            <TweetInfo
              userName={props.user?.userName}
              createdAt={props.createdAt}
              name={props.user?.name}
              id={props.user.id}
              userId={props.user.id}
              tweetId={props.id}
              loggedUser={props.loggedUser}
              tweetMediaUrls={props.mediaUrls}
              tweet={props.tweet}
            />

            {/* the text/media of the original tweet */}
            <div className="tweet-content ml-2">
              <span>
                {props.text}
              </span>
              <QuotedTweet OTweet={props.originalTweet} repliedToTweet={props.repliedToTweet} />

              <TweetToolbarIcons
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
    case "R":
      return <div>
        {
          (props.originalTweet.state === "R") ? <FoF /> :

            <Fragment>
              <p className="font-bold px-4 text-gray-600">
                <span><svg className="w-4 h-4 text-gray-600 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 
                  7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 
                  13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd" /></svg></span>
                <span onClick={goToProfile} className="hover:pointer" > {props.user.name} retweeted </span>
              </p>
              <Retweet id={props.originalTweet.id} />
            </Fragment>
        }
        <hr />
      </div>

    default:
      return <FoF />
  }

}

export default Tweet;