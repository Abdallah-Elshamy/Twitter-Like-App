import React, { useState } from 'react'
import './tweet.css';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import Modal from '../../UI/Modal/Modal';
import PostTweet from './PostTweet';
import Tweet_info from './Tweet_Info';
import Tweet_img from './Tweet_img';
import Tweet_Info from './Tweet_Info';
import {cache} from "../../common/cache"
import {Get_SFW} from "../../common/queries/GET_SFW"
import {useMutation, useQuery} from "@apollo/client"
import {CustomDialog} from 'react-st-modal'
import LikeTweet from "../../common/queries/likeTweet"
import UnlikeTweet from "../../common/queries/unlikeTweet"
import ErrorDialog from "../../UI/Dialogs/ErroDialog"
import {updateTweetsCacheForLikeTweet, updateTweetsCacheForUnlikeTweet} from "../../common/utils/writeCache"

export interface TweetData {
  user?: {
    id?: string
    imageURL?: string
    name?: string
    userName?: string
  }
  id?: string
  text: string
  likesCount?: number
  repliesCount?: number
  createdAt?: number
  isLiked?: boolean
}

function Tweet(props: any) {
  const sfw = useQuery(Get_SFW).data;
  const [edit, setEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);
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
   
  

  return (


    <div className="tweet-box ">

      <Modal show={edit} modalClosed={modalClosed} className="pb-4" >

        <header className="flex justify-between items-center px-3 h-8 w-full border-b border-gray-200 pb-6 pt-2">

          <div onClick={modalClosed} className=" p-1 rounded-full">
            <svg className="h-8 w-5 pt-2 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

        </header>
        <PostTweet />
      </Modal>

      <Tweet_img imageURL={props.user?.imageURL} id={props.user?.id} />

      <div className="tweet-aside">

        <Tweet_Info
          userName={props.user?.userName}
          createdAt={props.createdAt}
          name={props.user?.name}
          id={props.user.id}
          userId={props.user.id}
          tweetMediaUrls = {props.mediaUrls}
          tweet = {props.tweet}
          tweetId={props.id}
          loggedUser={props.loggedUser}

        />

        {/*  <div className="tweet-data py-1">
          <p className="font-bold mr-1">{props.user?.name}</p>
          <p className="p--light-color"> @{props.user?.userName} . </p>
          <p className="p--light-color px-1"> {props.createdAt ? timeConverter(Number(props.createdAt)) : null}</p>
          <span className="tweet-ellipsis p--light-color z-10 ">


            <ToolBox
              design={
                <i className="fas fa-ellipsis-h"></i>
              }
            >

              <ul className=" mb-40 ml-4 absolute bg-gray-100 " >

                <a href="/profile" className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >block</a>
                <a className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >mute</a>

              </ul>
            </ToolBox>

          </span>
        </div> */}


        <div className="tweet-content">
          <span>
            {props.text}
          </span>
          <div className="tweet-toolbar p--light-color">
            <a onClick={() => setEdit(true)}>
              <i className="fas fa-reply text-base font-sm "></i>
              <span>{props.repliesCount}</span>
            </a>

            <a>
              <ToolBox
                design={
                  <div className="border-0">
                    <i className="fas fa-retweet text-base font-sm"></i>
                    <span>2</span>
                  </div>
                }
              >
                <ul className="mb-40 absolute ml-12 bg-gray-100" >
                  <a href="/profile" className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >Retweet</a>
                  <a className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" onClick={() => setEdit(true)}>quote Retweet</a>

                </ul>
              </ToolBox>
            </a>

            <button className="outline-none focus:outline-none" onClick={handleLikeButton}>
              <i className={"text-base font-sm rounded-3xl transform hover:scale-110 "+(props.isLiked?"fas fa-heart text-red-600":"far fa-heart")}></i>
              <span>{props.likesCount}</span>
            </button>

          </div>
        </div>
      </div>
    </div>

  )
}

export default Tweet;
