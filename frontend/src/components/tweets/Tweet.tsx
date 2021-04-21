import React , { useState } from 'react'
import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";

import { timeConverter } from '../../common/utils/timestamp';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import Modal from '../../UI/Modal/Modal';

export interface TweetData {
  user?: {
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

function Tweet(props:any){
  const [edit, setEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);

  return(


    <div className="tweet-box ">

    <Modal show={edit} modalClosed={modalClosed}>

  </Modal>


    <div className="tweet-icon mr-2">
      {props.user?.imageURL ? (
        <img src={props.user?.imageURL}
          alt="avatar" />
      ) : (<img src={avatar} alt="avatar" />)}
    </div>
    <div className="tweet-aside">
      <div className="tweet-data py-1">
        <p className="font-bold mr-1">{props.user?.name}</p>
        <p className="p--light-color"> @{props.user?.userName} . </p>
        <p className="p--light-color px-1"> {props.createdAt ? timeConverter(Number(props.createdAt)) : null}</p>
        <span className="tweet-ellipsis p--light-color">
          <i className="fas fa-ellipsis-h"></i>
        </span>
      </div>
      <div className="tweet-content">
        <span>
          {props.text}
        </span>
        <div className="tweet-toolbar p--light-color">
          <a href="/">
            <i className="fas fa-reply text-base font-sm "></i>
            <span>{props.repliesCount}</span>
          </a>

          <a>
            <ToolBox 
            design = {
              <div className = "border-0">
              <i className="fas fa-retweet text-base font-sm"></i>
             <span>2</span>
             </div>
            }
            >
          <ul className= "mb-40 absolute ml-12 bg-gray-100 " >

          <a href="/profile" className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >Retweet</a>
          <a  className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" onClick={() => setEdit(true)}>quote Retweet</a>

          </ul>
            </ToolBox>
          </a>

          <a href="/">
            <i className="far fa-heart text-base font-sm"></i>
            <span>{props.likesCount}</span>
          </a>
        </div>
      </div>
    </div>

  </div>
  )
}

export default Tweet ;