import React from 'react';
import './PersonItem.css'
import '../../../profile/profile.css'


export interface ChatItemEntity {
  id: string,
  name: string,
  username: string,
  imageURL?: string,
  lastMessage?: string,
  numberOfUnseen?: string
}

const ChatItem: React.FC<ChatItemEntity> = (user: ChatItemEntity) => {
  const profilePicture = (user.imageURL === undefined || user.imageURL === null) ?
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg> :
    <img className="rounded-full w-full" src={user.imageURL} alt="user" />;
  return (

    <div className=" person-item flex  justify-between items-start p-3 hover:bg-gray-100 relative cursor-pointer" >
      <div className="w-1 h-full bg-blue-500">
      </div>
      <div className="person-item-image w-11 h-11  rounded-full  flex-none mr-2 ">
        {profilePicture}
      </div>

      <div className="flex-grow">
        <h1 className="person-item-name  text-xm font-bold">{user.name}</h1>
        <p className="person-item-username"><span className="text-xm">@</span>{user.username}</p>
      </div>
      <div className="relative mt-10 left-7">
        {/*localStorage.getItem('token') && (id == parseJwt(localStorage.getItem('token')).id) ? null :
  <FollowButton id={id} following={isFollowing} />*/}

        {//if showing convwersation show number of unseen messages
          user.numberOfUnseen && <div className=" w-3 h-3 rounded-full
        bg-red-600 p-2 text-white font-bold">
            <span>{user.numberOfUnseen}</span>
          </div>
        }
      </div>
    </div>
  )
}
export default ChatItem;

