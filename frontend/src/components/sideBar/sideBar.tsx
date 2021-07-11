
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from "react-router-dom";
import '../../App.css';
import "../../styles/layout.css"
import { parseJwt } from "../../common/utils/jwtDecoder"
import { SideBarItem } from './sideBarItem/sideBarItem'
import { TweetButton } from './tweetButton/tweetButton'
import { FlootProfile } from './flootProfile/flootProfile'
import Modal from '../../UI/Modal/Modal';
import PostTweet from '../tweets/PostTweet';
import AllUnseenMessagesCount from "../../common/queries/allUnseenMessagesCount"

export function SideBar() {
  let loggedUser;
  const { data: unSeenCountData, loading, error } = useQuery(AllUnseenMessagesCount);
  if (localStorage.getItem("token")) {
    loggedUser = parseJwt(localStorage.getItem("token")!)
  }
  let unSeenCount = 0
  if (!loading && unSeenCountData) {
    unSeenCount = (unSeenCountData?.getUnseenMessages?.totalCount || 0)
  }
  const [edit, setEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);

  return (

    <div className="px-2 fixed top-0">
      <div className="wall">
        <Modal show={edit} modalClosed={modalClosed} className="pb-4">

          <header className="flex justify-between items-center px-3 h-8 w-full border-b border-gray-200 pb-6 pt-2">
            <div onClick={modalClosed} className=" p-1 rounded-full">
              <svg className="h-8 w-5 pt-2 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </header>

          <PostTweet />
        </Modal>
      </div>


      <Link to="/">
        <SideBarItem item_name='   ' icon_name="fab fa-twitter" />
      </Link>

      <Link to="/">
        <SideBarItem item_name='Home' icon_name="	fas fa-home" />
      </Link>

      <Link to="/explore">
        <SideBarItem item_name='Explore' icon_name="fas fa-hashtag" />
      </Link>



      <Link to="/messages">
        <SideBarItem item_name='Messages' icon_name="fas fa-envelope" countUnseen={unSeenCount} />
      </Link>

      <Link to="/profile">
        <SideBarItem item_name='Profile ' icon_name="fas fa-user" />
      </Link>


      {loggedUser?.isAdmin ? <Link to='/admin'>
        <SideBarItem item_name='Admin' icon_name="fas fa-user-lock" />
      </Link> : null}


      {/* 
      <TweetButton name="Tweet" className="w-56 h-12 mt-8" onClick={() => setEdit(true)} /> */}

      < FlootProfile />

    </div>

  )
}
