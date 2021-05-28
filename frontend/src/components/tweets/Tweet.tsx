import React, { Fragment, useState } from 'react'
import './tweet.css';
import { useHistory } from 'react-router';
import TweetInfo from './TweetInfo';
import TweetImg from './TweetImg';
import Viewer from 'react-viewer';
import ReactPlayer from 'react-player'
import {cache} from "../../common/cache"
import {useMutation} from "@apollo/client"
import {CustomDialog} from 'react-st-modal'
import LikeTweet from "../../common/queries/likeTweet"
import UnlikeTweet from "../../common/queries/unlikeTweet"
import ErrorDialog from "../../UI/Dialogs/ErroDialog"
import {updateTweetsCacheForLikeTweet, updateTweetsCacheForUnlikeTweet} from "../../common/utils/writeCache"
import TweetToolbarIcons from './TweetToolbarIcons';
import QuotedTweet from './QoutedTweet';
import { Link } from 'react-router-dom';
import FoF from '../../UI/FoF/FoF';
import Retweet from './Retweet';


function Tweet(props: any) {
  let img:any =[]
  const history = useHistory();
  const [ visible, setVisible ] = React.useState(false);
  const [likeTweet] = useMutation(LikeTweet, {
    update(cache) {
      updateTweetsCacheForLikeTweet(cache, props.tweet.id, props.loggedUser.id, false)
      updateTweetsCacheForLikeTweet(cache, props.tweet.id, props.loggedUser.id, true)
    }
  })
  const [unlikeTweet] = useMutation(UnlikeTweet, {
    update(cache) {
      updateTweetsCacheForUnlikeTweet(cache, props.tweet.id, props.loggedUser.id, false)
      updateTweetsCacheForUnlikeTweet(cache, props.tweet.id, props.loggedUser.id, true)
    }
  })
  const displayUploadedFiles=(urls:string[])=> {
    if (urls.length > 0){ 
    if (urls[0].includes(".com/videos/")){
      return <div style={{height:"300px"}} >
      <ReactPlayer url={urls[0]} height="300px" width="500px"  controls={true}/>
      </div>
    }
    else {
    const check = (urls.length == 3)? true : false
    img = urls.map ((url)=> {return {src:url}})
    return urls.map((url, i) => 
    <Fragment>
    <img 
    className="Img"
    style={{gridRow:(check && (i==1))?" 1/3":"",
    gridColumn: (check && (i==1))?" 2/3":"", 
    height: ((check && (i==1)) || (urls.length == 1 && i == 0) || (urls.length ==2) )?"300px":"", 
    objectFit: "cover"}} 
    key={i}  src={url} onClick={() => { setVisible(true); }}  alt="tweet"/>

    <Viewer
    visible={visible}
    onClose={() => { setVisible(false); } }
    images={img}
    />
    </Fragment>
    )}}

  }
  const handleLikeButton = async(e: any) => {
    try {
      if(!props.isLiked) {
        cache.modify({
          id: `Tweet:${props.id}`,
          fields: {
              isLiked() {
                  return true;
              },
              likesCount(cachedLikesCount: any){
                  return cachedLikesCount + 1
              }
          },  
        });
        await likeTweet({
          variables: {
            tweetId: props.id
          }
        })
      } else {
        cache.modify({
          id: `Tweet:${props.id}`,
          fields: {
              isLiked() {
                  return false;
              },
              likesCount(cachedLikesCount: any){
                return cachedLikesCount - 1
            }
          },  
        });
        await unlikeTweet({
          variables: {
            tweetId: props.id
          }
        })
      }
      
    } catch (e) {
      let unliked: any
      cache.modify({
        id: `Tweet:${props.id}`,
        fields: {
            isLiked(cachedIsLiked: any) {
                unliked = cachedIsLiked
                return !unliked;
            },
            likesCount(cachedLikesCount: any){
                if (unliked) {
                  return cachedLikesCount + 1
                }
                else {
                  return cachedLikesCount - 1
                }
            }
        },  
      });
      const error = await CustomDialog(<ErrorDialog message={"Something went wrong please try again!"} />, {
        title: 'Error!',
        showCloseIcon: false,
      });
      }
    }
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
  console.log("urls are", props.mediaUrls)
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
              {(props.mediaURLs) && 
                <div className="gg-box">

                { displayUploadedFiles(props.mediaURLs) }

              </div>}
              <TweetToolbarIcons
                tweetId={props.id}
                state={props.state}
                repliesCount={props.repliesCount}
                likesCount={props.likesCount}
                isLiked={props.isLiked}
                handleLikeButton = {handleLikeButton}
                quotedRetweetsCount={props.quotedRetweetsCount}
                retweetsCount={props.retweetsCount}
                isRetweeted={props.isRetweeted}

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
              handleLikeButton = {handleLikeButton}
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
              {(props.mediaURLs) && 
                <div className="gg-box">

                { displayUploadedFiles(props.mediaURLs) }

              </div>}
              <TweetToolbarIcons
                tweetId={props.id}
                state={props.state}
                isLiked={props.isLiked}
                handleLikeButton = {handleLikeButton}
                repliesCount={props.repliesCount}
                likesCount={props.likesCount}
                quotedRetweetsCount={props.quotedRetweetsCount}
                retweetsCount={props.retweetsCount}
                isRetweeted={props.isRetweeted}
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
              {(props.mediaURLs) && 
                <div className="gg-box">

                { displayUploadedFiles(props.mediaURLs) }

              </div>}
              <QuotedTweet OTweet={props.originalTweet} repliedToTweet={props.repliedToTweet} />
              
              <TweetToolbarIcons
                tweetId={props.id}
                state = {props.state}
                repliesCount={props.repliesCount}
                likesCount={props.likesCount}
                quotedRetweetsCount={props.quotedRetweetsCount}
                handleLikeButton = {handleLikeButton}
                isLiked={props.isLiked}
                retweetsCount={props.retweetsCount}
                isRetweeted={props.isRetweeted}

              />

            </div>
          </div>
        </div>
        {/* the end of tweet */}


        <hr />
      </div>
    case "R":

      return <Fragment>
        {

          (!props.originalTweet || props.originalTweet.state === "R")
             ? null :

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
              <hr />
            </Fragment>
        }

      </Fragment>

    default:
      return <FoF />
  }

}

export default Tweet;