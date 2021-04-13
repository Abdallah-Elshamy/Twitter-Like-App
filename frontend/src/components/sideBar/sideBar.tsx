import React , { useState } from 'react'
import { Link } from "react-router-dom";
import '../../App.css';

import { SideBarItem } from './sideBarItem/sideBarItem'
import { TweetButton } from './tweetButton/tweetButton'
import { FlootProfile } from './flootProfile/flootProfile'
import Modal from '../../UI/Modal/Modal';




export function SideBar() {


  const [edit, setEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);



  return (
    
    <div className="px-2" >
      <Modal show={edit}
        modalClosed={modalClosed}
        >
           <SideBarItem item_name='    ' icon_name="fab fa-twitter" />
      </Modal>

      <Link to="/">
        <SideBarItem item_name='    ' icon_name="fab fa-twitter" />
      </Link>

      <Link to="/">
        <SideBarItem item_name='Home' icon_name="	fas fa-home" />
      </Link>

      <Link to="/explore">
        <SideBarItem item_name='Explore' icon_name="fas fa-hashtag" />
      </Link>

      <Link to="/Notifications">
        <SideBarItem item_name='Notifications' icon_name="fas fa-bell" />
      </Link>

      <Link to="/messages">
        <SideBarItem item_name='Messages' icon_name="fas fa-envelope" />
      </Link>

      <Link to="/profile">
        <SideBarItem item_name='Profile ' icon_name="fas fa-user" />
      </Link>

      <Link to='/setting'>
        <SideBarItem item_name='Setting' icon_name="fas fa-cog" />
      </Link>


      <TweetButton name="Tweet" className="w-56" onClick={() => setEdit(true)} />
      < FlootProfile />

    </div>

  )
}







