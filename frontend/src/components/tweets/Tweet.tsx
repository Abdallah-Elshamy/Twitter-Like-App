import React, { Fragment, useState } from 'react'
import './tweet.css';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import Modal from '../../UI/Modal/Modal';
import PostTweet from './PostTweet';
import Tweet_img from './Tweet_img';
import Viewer from 'react-viewer';
import ImageSlideshow from 'material-ui/svg-icons/image/slideshow';
import {LIKE, UNLIKE} from '../../common/queries/like'
import { useMutation } from '@apollo/react-hoc';
import Tweet_Info from './Tweet_Info';

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
  mediaURLs?:string[]
}

function Tweet(props: any) {
  let img:any =[]
  const [edit, setEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);
  const [ visible, setVisible ] = React.useState(false);



  const displayUploadedFiles=(urls:string[])=> {
    const check = (urls.length == 3)? true : false
    img = urls.map ((url)=> {return {src:url}})
    return urls.map((url, i) => 
    <Fragment>
    <img className="w-full h-15 cursor-pointer" 
    style={{gridRow:(check && (i==1))?" 1/3":"",
    gridColumn: (check && (i==1))?" 2/3":"", 
    height: (check && (i==1))?"300px":""}}  key={i}  src={url} onClick={() => { setVisible(true); }}  alt="tweet"/>

    <Viewer
    visible={visible}
    onClose={() => { setVisible(false); } }
    images={img}
    />
    </Fragment>
    )

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
          {(props.mediaURLs) && 
                <div className="gg-box">

                { displayUploadedFiles(props.mediaURLs) }

              </div>}
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
                    <span>{props.quotedRetweetsCount}</span>
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

            <button  className="focus:outline-none hover:bg-red-100 hover:text-red-500 rounded-full py-2 px-2">
              <i className="far fa-heart text-base font-sm"></i>
              <span>{props.likesCount}</span>
            </button>

          </div>
        </div>
      </div>
    </div>

  )
}

export default Tweet;
