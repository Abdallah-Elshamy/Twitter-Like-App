import React from 'react';

import { PersonEntity } from '../../../../common/TypesAndInterfaces';

import './PersonItem.css'
import '../../../profile/profile.css'
import FollowButton from '../../../FollowButton/FollowButton';
import { decodedToken } from '../../../../App';


const TrendItem: React.FC<PersonEntity> = ({ id, bio, isFollowing, name, username, followed = false, imageURI, numberOfFollowers }) => {
  const profilePicture = (imageURI === undefined || imageURI === null) ?
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg> :
    <img className="rounded-full w-full" src={imageURI} alt="user" />;
  return (

    <div className=" person-item flex  justify-between items-start p-3">

      <div className="person-item-image w-11 h-11  rounded-full  flex-none mr-2 ">
        {profilePicture}
      </div>

      <div className="flex-grow">
        <h1 className="person-item-name  text-xm font-bold">{name}</h1>
        <p className="person-item-username"><span className="text-xm">@</span>{username}</p>
        <p>{bio}</p>
      </div>
      <div>
          {decodedToken && (id == decodedToken.id) ? null :
          <FollowButton id={id} following={isFollowing} />}
      </div>
    </div>
  )
}
export default TrendItem;
