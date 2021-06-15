import { useState } from 'react'
import './tweet.css';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import Modal from '../../UI/Modal/Modal';
import PostTweet from './PostTweet';
import { useMutation } from '@apollo/client';
import { RETWEET } from '../../common/queries/RETWEET';
import ErrorDialog from '../../UI/Dialogs/ErroDialog';
import { CustomDialog } from 'react-st-modal';
import DangerConfirmationDialog from '../../UI/Dialogs/DangerConfirmationDialog';
import UNRETWEET from '../../common/queries/UNRETWEET';
import {cache} from "../../common/cache"
import {updateTweetsCacheForRetweet, updateTweetsCacheForUnretweet} from "../../common/utils/writeCache"
import { parseJwt } from "../../common/decode";



function TweetToolbarIcons(props: any) {

  const [edit, setEdit] = useState<boolean>(false);
  const [replyEdit, replySetEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);
  const replyModalClosed = () => replySetEdit(false);
  const [unretweet] = useMutation(UNRETWEET, {
    update(cache) {
    const loggedUser = parseJwt(localStorage.getItem('token')!)
    const serializedState = cache.extract()
    const allTweetsInCache = Object.values(serializedState).filter((item:any) => item.__typename === 'Tweet')
    const retweetedTweet: any = allTweetsInCache.filter((tweet: any) => {
      return tweet?.originalTweet?.__ref === `Tweet:${props.tweetId}` && tweet?.user?.__ref === `User:${loggedUser.id}` && tweet?.state === "R"
    })[0]
    console.log("retweetedTweet", retweetedTweet)
    if (retweetedTweet){
      const normalizedId = cache.identify({
        id: retweetedTweet.id,
        __typename: "Tweet",
      });
      if (normalizedId) {
        cache.evict({ id: normalizedId });
      }
    }
    updateTweetsCacheForUnretweet(cache)
    
  }})
  const [retweet, rtData] = useMutation(RETWEET, {
    update: updateTweetsCacheForRetweet
  })

  const handleRetweetButton = async(e: any) => {
    let tryingToRetweet: boolean;
    try {
      if(!props.isRetweeted) {
        tryingToRetweet = true;
        cache.modify({
          id: `Tweet:${props.tweetId}`,
          fields: {
              isRetweeted() {
                  return true;
              },
              retweetsCount(cachedRetweetsCount: any){
                  return cachedRetweetsCount + 1
              }
          },  
        });
        await retweet({
          variables: {
            tweetId: props.tweetId
          }
        })
      } else {
        tryingToRetweet = false;
        cache.modify({
          id: `Tweet:${props.tweetId}`,
          fields: {
            isRetweeted() {
                  return false;
              },
            retweetsCount(cachedRetweetsCount: any){
                return cachedRetweetsCount - 1
            }
          },  
        });
        await unretweet({
          variables: {
            tweetId: props.tweetId
          }
        })
      }
      
    } catch (e) {
      console.log("error", e)
      let unretweeted: any
      cache.modify({
        id: `Tweet:${props.tweetId}`,
        fields: {
            isRetweeted(cachedIsRetweeted: any) {
                unretweeted = cachedIsRetweeted
                return !unretweeted;
            },
            retweetsCount(cachedRetweetsCount: any){
                if (tryingToRetweet) {
                  return cachedRetweetsCount - 1
                }
                else {
                  return cachedRetweetsCount + 1
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
  const handleRetweet = async () => {
    try {
      await retweet({ variables: { tweetId: props.tweetId } })
    }
    catch (e) {
      await CustomDialog(<ErrorDialog message={e.message} />, {
        title: 'Error!',
        showCloseIcon: false,
      });
    }
  }
  const handleDeleteButton = async () => {
    try {
      const result = await CustomDialog(<DangerConfirmationDialog message={"Are you sure you want to unretweet!"} />, {
        title: 'Confirm unretweet',
        showCloseIcon: false,
      });
      if (result) {
        await unretweet({
          variables: {
            tweetId: props.tweetId
          }
        })

      }
    }
    catch (e) {
      await CustomDialog(<ErrorDialog message={e.message} />, {
        title: 'Error!',
        showCloseIcon: false,
      });
    }
  }

  return (

    <div className="tweet-toolbar p--light-color" >


      <Modal show={edit} modalClosed={modalClosed} className="pb-4" >

        <header className="flex justify-between items-center px-3 h-8 w-full border-b border-gray-200 pb-6 pt-2">

          <div onClick={(e) => {modalClosed(); e.stopPropagation() }} className=" p-1 rounded-full">
            <svg className="h-8 w-5 pt-2 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

        </header>
        <PostTweet originalId={props.tweetId} postType="Qretweet" />
      </Modal>

      <Modal show={replyEdit} modalClosed={replyModalClosed} className="pb-4" >
        <header className="flex justify-between items-center px-3 h-8 w-full border-b border-gray-200 pb-6 pt-2">

          <div onClick={(e) => {replyModalClosed(); e.stopPropagation() }} className=" p-1 rounded-full">
            <svg className="h-8 w-5 pt-2 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

        </header>
        <PostTweet originalId={props.tweetId} postType="reply"/>
      </Modal>



      <a onClick={(e) => { replySetEdit(true); e.stopPropagation() }}>
        <i className="fas fa-reply text-base font-sm " ></i>
        <span>{props.repliesCount}</span>
      </a>

      <a onClick={(e) => e.stopPropagation()}>
        <ToolBox
          design={
            <div className="border-0">
              <i className={`fas fa-retweet text-base font-sm  ${props.isRetweeted ? "text-green-500" : ""}`}></i>
              <span>{Number(props.quotedRetweetsCount + props.retweetsCount)} </span>
            </div>
          }
        >
          <ul className="mb-40 absolute ml-12 bg-gray-100">

            {!props.isRetweeted ?
              <button onClick={(e) => {
                handleRetweetButton(e);
              }} className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" disabled={rtData && rtData.loading} >Retweet</button>
              :
              <button onClick={(e) => {
                handleRetweetButton(e)
              }} className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" disabled={rtData && rtData.loading} >Undo retweet</button>
            }
            <a className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" onClick={(e) => { setEdit(true); e.stopPropagation() }}>Quote Retweet</a>

          </ul>
        </ToolBox>
      </a>

      <button onClick={(e) => {props.handleLikeButton(); e.stopPropagation()}}>
      <i className={"text-base font-sm rounded-3xl transform hover:scale-110 "+(props.isLiked?"fas fa-heart text-red-600":"far fa-heart")}></i>
        <span>{props.likesCount}</span>
      </button>

    </div>

  )
}
export default TweetToolbarIcons;