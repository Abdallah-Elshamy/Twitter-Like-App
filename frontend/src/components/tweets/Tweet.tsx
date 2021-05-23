import React from 'react'
import './tweet.css';

import { useHistory } from 'react-router';
import TweetInfo from './TweetInfo';
import TweetImg from './TweetImg';
import TweetToolbarIcons from './TweetToolbarIcons';
import QuotedTweet from './QoutedTweet';
import { Link } from 'react-router-dom';


function Tweet(props: any) {

  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + props.id,
    })
  }

  switch (props.state) {

    case "O":
      return <div>
        <div className="tweet-box mt-2" onClick={e => { goToTweet(); e.stopPropagation() }} >
          <TweetImg imageURL={props.user.imageURL} id={props.user?.id} className="tweet-icon " />

          <div className="tweet-aside -ml-2">
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

            <div className="tweet-content">
              <span>
                {props.text}
              </span>

              <TweetToolbarIcons
                repliesCount={props.repliesCount}
                likesCount={props.likesCount}
                quotedRetweetsCount={props.quotedRetweetsCount}
                retweetsCount={props.retweetsCount}
              />

            </div>
          </div>
        </div>

        <hr />
      </div>

    case "C":
      return <div>

        <div className="tweet-box mt-2 flex w-full p-2" onClick={e => { goToTweet(); e.stopPropagation() }} >
          <TweetImg imageURL={props.user.imageURL} className="tweet-icon" />
          <div className="tweet-aside -ml-2">
            <TweetInfo
              id={props.user?.id}
              userName={props.user?.userName}
              createdAt={props.createdAt}
              name={props.user?.name}

            />
            {/* the added design of Reply design  */}
            <div className="space-x-2 -mt-2 ">
              <p className=" p--light-color inline-block"> Repling to </p>
              <Link onClick={e => { e.stopPropagation() }}
                to={'/' + props.repliedToTweet.user.id}
                className="text-blue-500 inline-block hover:underline">
                @{props.repliedToTweet.user?.userName}</Link>
            </div>

            {/* the text/media of the original tweet */}
            <div className="tweet-content ml-2 pb-4 pt-2">
              <span>
                {props.text}
              </span>
              <TweetToolbarIcons
                repliesCount={props.repliesCount}
                likesCount={props.likesCount}
                quotedRetweetsCount={props.quotedRetweetsCount}
                retweetsCount={props.retweetsCount}
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
    default:
      return <div>
        <a onClick={e => { goToTweet(); e.stopPropagation() }} >
          unhaundled case "{props.state}"
        </a>
        <hr />
      </div>
  }

}

export default Tweet;