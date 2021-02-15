import React from 'react'
import { Link, useHistory } from "react-router-dom";
import '../../App.css';

import { SideBarItem } from './sideBarItem/sideBarItem'
import { TweetButton } from './tweetButton/tweetButton'
import { FlootProfile } from './flootProfile/flootProfile'
import { parseJwt } from '../../common/decode';

export function SideBar() {
  var profile;
  const routeHistory = useHistory();
  const navigate = (route: string) => routeHistory.push(route)

  if (localStorage.getItem('token') !== "LOGOUT") {
    profile = parseJwt(localStorage.getItem('token'))
  }
  else {
    navigate('/error')
  }

  return (
    <div className="px-2" >



      <Link to="/">
        <SideBarItem item_name='     ' icon_name="fab fa-twitter" />
      </Link>

      <Link to="/">
        <SideBarItem item_name='Home' icon_name="	fas fa-home" />
      </Link>

      <Link to="/Explore">
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


      <TweetButton name="Tweet" className="w-56" />
      < FlootProfile />

      <p>{profile.name}  </p>
      <p>{profile.userName}  </p>
      <p>{profile.email}  </p>


    </div>

  )
}







