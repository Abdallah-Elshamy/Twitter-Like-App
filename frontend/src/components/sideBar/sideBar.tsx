import React from 'react'
import { Link } from "react-router-dom";
import '../../App.css';

import { SideBarItem } from './sideBarItem/sideBarItem'
import { TweetButton } from './tweetButton/tweetButton'
import { FlootProfile } from './flootProfile/flootProfile'
import {  useQuery } from '@apollo/client';
import {LoggedUser} from '../../common/queries/Userqery'; 
import { parseJwt } from '../../common/decode';
import {User} from '../../common/TypesAndInterfaces'
import {userVar} from "../../common/cache"
import Loading from '../../UI/Loading'


export function SideBar() {
  // here 
  var profile:any;
  if (localStorage.getItem('token') !== " ") {
    profile = parseJwt(localStorage.getItem('token'));
  }
  const { loading, error, data } = useQuery(LoggedUser, { variables: { id: profile.id } });

   if (loading) 
    return (<div className="mt-8"> </div>);
  if (error)
    return <p>`Error! ${error.message}`</p>;
  else {
    const user: User = data.user;
    userVar({ user: user });
  } 
  
  return (
    <div className="px-2" >

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


      <TweetButton name="Tweet" className="w-56 h-12 mt-8" />
      < FlootProfile />

    </div>

  )
}







