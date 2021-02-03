import React from 'react'
import '../../App.css';

import { SideBarItem } from './sideBarItem/sideBarItem'
import { TweetButton } from './tweetButton/tweetButton'
import { FlootProfile } from './flootProfile/flootProfile'


export const SideBar: React.FC = () =>  (
  <div className="px-2">
    <SideBarItem  item_name ='     '  icon_name = "fab fa-twitter"/>
    <SideBarItem item_name ='Home' icon_name ="	fas fa-home" />
    <SideBarItem item_name ='Explore'  icon_name = "fas fa-hashtag"/>
    <SideBarItem  item_name ='Notifications' icon_name ="fas fa-bell"/>
    <SideBarItem  item_name ='Messages' icon_name ="fas fa-envelope"/>
    <SideBarItem  item_name ='Profile ' icon_name = "fas fa-user"/>
    <SideBarItem  item_name ='Setting' icon_name ="fas fa-cog"/>
    <TweetButton name ="Tweet" className = "w-56"/>
    < FlootProfile/> 
</div>

)




