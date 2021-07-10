import React, { Fragment, useRef } from 'react';
import './PersonItem.css'
import '../../../profile/profile.css'
import { timeConverter } from '../../../../common/utils/timestamp';
import { chatUserVar } from '../../../../common/cache';
import { useMutation, useQuery } from '@apollo/client';
import { Active_Chat_User } from '../../../../common/queries/Active_Chat_User';
import ALL_SEEN from '../../../../common/queries/ALL_SEEN';
import {setUnseenConvToZero} from "../../../../common/utils/writeCache"


export interface ChatItemEntity {
  id: string,
  name: string,
  username: string,
  imageURL?: string,
  lastMessage?: string,
  numberOfUnseen?: number,
  createdAt?: string
}



const ChatItem: React.FC<ChatItemEntity> = (user: ChatItemEntity) => {
  const unseen = (user.numberOfUnseen != undefined) && (user.numberOfUnseen !== 0)
  const [setAllSeen] = useMutation(ALL_SEEN)
  const handleClick = () => {
    chatUserVar({
      id: user.id,
      name: user.name,
      username: user.username,
      imgURL: user.imageURL
    })  
    setUnseenConvToZero(user?.id)
  }
  const profilePicture = (user.imageURL === undefined || user.imageURL === null) ?
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg> :
    <img className="rounded-full w-full" src={user.imageURL} alt="user" />;



  return (
    <Fragment>

      <div onClick={handleClick} className={` person-item flex  justify-between items-start p-3 hover:bg-gray-100 relative cursor-pointer ${unseen ? "bg-gray-100" : ""}`}>

        <div className="person-item-image w-11 h-11  rounded-full  flex-none mr-2 ">
          {profilePicture}
        </div>

        <div className="flex-grow">
          <div className="flex">
            <h1 className="person-item-name inline-block  text-xm font-bold mr-1">{user.name}</h1>
            <p className="person-item-username"><span className="inline-block text-xm">@</span>{user.username}</p>
          </div>

          <div className="flex justify-between"><span className="truncate w-44">{user.lastMessage}</span>
          </div>
        </div>
        <div className="flex-col items-center ">
          {/*localStorage.getItem('token') && (id == parseJwt(localStorage.getItem('token')).id) ? null :
  <FollowButton id={id} following={isFollowing} />*/}

          {//if showing convwersation show number of unseen messages
            unseen &&
            <div className="w-4 min-w-min  rounded-full mr-auto
        bg-red-600 grid place-items-center  text-white  text-xs font-semibold px-1">
              {user.numberOfUnseen}
            </div>

          }

          <div>{user.createdAt ? timeConverter(Number(user.createdAt), true, false) : null}</div>
        </div>
      </div>
    </Fragment >

  )
}
export default ChatItem;

