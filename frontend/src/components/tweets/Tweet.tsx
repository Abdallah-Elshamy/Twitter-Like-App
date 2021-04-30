import React , { useState }from 'react'
import './tweet.css';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import Modal from '../../UI/Modal/Modal';
import PostTweet from './PostTweet';
import Tweet_img from './Tweet_img';
import Tweet_Info from './Tweet_Info';
import { useHistory } from 'react-router';

export interface TweetData {
  user?: {
    id?: string
    imageURL?: string
    name?: string
    userName?: string
  }
  id: string
  text: string
  likesCount?: number
  repliesCount?: number
  retweetsCount?:number
  quotedRetweetsCount?:number
  createdAt?: number
  isLiked?: boolean
}

function Tweet(props: any) {
  const [edit, setEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);

  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + props.id,
    })
  }
  return (
    <div className="tweet-box " onClick={goToTweet}>

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

        />

        {/*  <div className="tweet-data py-1">
          <p className="font-bold mr-1">{props.user?.name}</p>
          <p className="p--light-color"> @{props.user?.userName} . </p>
          <p className="p--light-color px-1"> {props.createdAt ? timeConverter(Number(props.createdAt)) : null}</p>
          <span className="tweet-ellipsis p--light-color z-10 ">


  <div className="tweet-aside">
    <Tweet_info
      userName={props.user?.userName}
      createdAt={props.createdAt}
      name={props.user?.name}
    />

 {/* the text/media of the original tweet */}
        <div className="tweet-content">        
          <span>
            {props.text}
          </span>
          <div className="tweet-toolbar p--light-color">
            <a onClick={(e) => { setEdit(true); e.stopPropagation() }}>
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
                <ul className="mb-40 absolute ml-12 bg-gray-100 " >

                  <a href="/profile" className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >Retweet</a>
                  <a className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" onClick={(e) => { setEdit(true); e.stopPropagation() }}>quote Retweet</a>

                </ul>
              </ToolBox>
            </a>

            <a href="/" >
              <i className="far fa-heart text-base font-sm"></i>
              <span>{props.likesCount}</span>
            </a>

        </div>
      </div>
    </div>
{/* the end of tweet */}

  
<hr />
   </div>
  
  )
}

export default Tweet;