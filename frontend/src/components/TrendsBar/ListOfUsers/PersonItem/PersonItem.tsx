import React from 'react';
import {ToolBox} from "../../../sideBar/toolbox/toolbox"
import { PersonEntity } from '../../../../common/TypesAndInterfaces';

import './PersonItem.css'
import '../../../profile/profile.css'
import FollowButton from '../../../FollowButton/FollowButton';
import { parseJwt } from '../../../../common/decode';
import { useHistory } from 'react-router';


const TrendItem: React.FC<PersonEntity> = ({ id, bio, isFollowing, name, username, followed = false, imageURI, numberOfFollowers }) => {
  const history = useHistory();

  const goToProfile = () => {
    history.push({
      pathname: '/' + id,
    })

  }

  const profilePicture = (imageURI === undefined || imageURI === null) ?
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg> :
    <img className="rounded-full w-full" src={imageURI} alt="user" />;

  return (

    <div className=" person-item flex  justify-between items-start p-3 hover:bg-gray-100 relative" onClick={goToProfile}>

      <div className="person-item-image w-11 h-11  rounded-full  flex-none mr-2 ">
        {profilePicture}
      </div>

      <div className="flex-grow">
        <h1 className="person-item-name  text-xm font-bold">{name}</h1>
        <p className="person-item-username"><span className="text-xm">@</span>{username}</p>
        <p>{bio}</p>
      </div>
      <div className="relative mt-10 left-7">
        {localStorage.getItem('token') && (id == parseJwt(localStorage.getItem('token')).id) ? null :
          <FollowButton id={id} following={isFollowing} />}
      </div>
      <ToolBox
          design={
            <i className="fas fa-ellipsis-h hover:bg-gray-400 p-1 px-2 rounded-full cursor-pointer"></i>
          }
        >
          <ul className=" bg-gray-100 mb-40 right-8 absolute bg-gray-100 z-10 cursor-pointer" >
          {/* {props?.loggedUser?.id == props?.tweet?.user?.id ? <button onClick={handleDeleteButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Delete</button>: null} */}
            <a href="/profile" className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >block</a>
            <a className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >mute</a>

          </ul>
        </ToolBox>
    </div>
  )
}
export default TrendItem;
