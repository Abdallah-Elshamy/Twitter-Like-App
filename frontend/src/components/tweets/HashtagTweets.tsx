import React, { Fragment } from 'react';
import '../../styles/layout.css'
import Tweet from './Tweet';
import { TweetData } from './TweetData_interface'
import { useQuery, } from '@apollo/client';
import Loading from './../../UI/Loading';
import { parseJwt } from '../../common/decode';
import { useLocation } from 'react-router';
import TrendsBar from '../TrendsBar/TrendsBar';
import { SideBar } from '../sideBar/sideBar';
import { Link } from 'react-router-dom';
import { Hash_Tweets } from "../../common/queries/Hash_Tweets"
const HashtagTweets: React.FC<any> = (props: any) => {

  const loggedUser = parseJwt(localStorage.getItem('token')!)
  const location = useLocation()
  let hashtag = location.pathname.substr(9)
	
let { loading, error, data } = useQuery<any>(Hash_Tweets, {
        variables: {
            word: hashtag
        },
    });

  return (
	
    <main className="main-container">
      <aside className="sb-left">< SideBar /></aside>
      <article className="wall">

        <header className="top-bar px-3 py-2">
          <span className=" m-3">
            <Link to="/">
              <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
            </Link>

          </span>
          <div>
            {/* <p className="font-bold mt-2 text-lg ">{tweet.user?.name} </p> */}
            <p className="font-extrabold mt-2 text-lg "> {"#" + hashtag} </p>
          </div>
        </header>
	{loading&&<Fragment><br /> <br /> <Loading size={30} /></Fragment>}
{error&&<p>SomeThing went wromg</p>}
{!error&&!loading&&data&&data?.hashtag.tweets?.tweets?.map((tweet: TweetData) => {
                return (
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
                        key={tweet.id}
                        quotedRetweetsCount={tweet.quotedRetweetsCount}
                        retweetsCount={tweet.retweetsCount}
                        state={tweet.state}
                        originalTweet={tweet.originalTweet}
                        repliedToTweet={tweet.repliedToTweet}
                    />
                );
            })}


      </article>

      <aside className="sb-right">< TrendsBar /></aside>
    </main>
  );
}

export default HashtagTweets;
