
import { useQuery } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import React, { Fragment } from 'react';
import bg from "../../routes/1500x500.jpeg";
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import FollowButton from '../FollowButton/FollowButton';
import {  useHistory } from "react-router-dom";
import { parseJwt } from '../../common/decode';
//  TWIT 63 

function ProfileInfo() {
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
    <Fragment>
      <header className="top-bar px-3 py-2">
        <span className=" m-3">
          <a href="http://">
            <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
          </a>
        </span>
        <div>
          <p className="font-extrabold text-lg ">{profile.name}</p>
          {/* featch fron tweet */}
          <p className="p--light-color block ">20 tweet</p> 
        </div>
      </header>
      <div className="pf--container">
        <div className="pf--bg" >
          {profile.imageURL? (
                      <img src={profile.imageURL}  
                      alt="avatar"/>
          ): (<img src={bg}/>)}

        </div>
        <div className="pf--avatar">
        {profile.coverImageURL? (
                      <img className="pf--avatar-img" src={profile.coverImageURL}  
                      alt="avatar"/>
          ): (<img className="pf--avatar-img" src={avatar}/>)}
        </div>

        <div className="pf--info">
          <div className="pf--flw-btn-div p-3 ">
            <FollowButton id="1" py="py-1.5" following={false} /></div>
          <div className="mx-2 ">
            <p className="font-extrabold text-lg pb-1">{profile.name}</p>
            <p className="p--light-color block pb-1">@{profile.userName}</p>
            <p>{profile.bio}</p>
            <div className="p--light-color pb-1">
            <span className="pr-2"><i className="fa fa-map-marker" aria-hidden="true"></i> Egypt ... cairo</span>
            <span className="px-2" ><i className="fa fa-gift" aria-hidden="true"></i> Born 9 January 1998 </span>
            <span className="px-2"><i className="fa fa-calendar" aria-hidden="true"></i> Joined {profile.createdAt}</span>
            </div>
            <div className="font-bold pb-1">
              {/* featch followers count  */}
              <a href="/"> 20 <span className="p--light-color mr-4 ">following</span> </a>
              <a href="/">30 <span className="p--light-color mr-4">Follower</span> </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProfileInfo;





