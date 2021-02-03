import React from 'react';
import { Link } from 'react-router-dom';

import { PersonEntity } from '../../../../common/TypesAndInterfaces';

import './PersonItem.css'
import '../../../../styles/profile.css'

const TrendItem: React.FC<PersonEntity> = ({name,username,followed=false,imageURI,numberOfFollowers}) => {
  console.log(imageURI)
  const profilePicture =  (imageURI===undefined || imageURI === null)? 
<svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>:
  <img className="rounded-full w-full" src={imageURI} alt="user"/>;
  return (
          <Link to={'/'+username}>

    <div className=" person-item flex  justify-between items-center p-3">
      <div className="person-item-image w-12 h-12 grid  rounded-full  flex flex-col mr-2 ">  
        
        {profilePicture}
         
      </div>
      <div className="flex-grow">
        <h1 className="person-item-name  text-xm font-bold">{name}</h1>
        <p>@{username}</p>
      </div>
      <div>
        <button className="pf--follow-btn rounded-full px-2 py-1" >
          {followed? "Following":"Follow"}
        </button>
      </div>
    </div></Link>
  )
}
export default TrendItem;
