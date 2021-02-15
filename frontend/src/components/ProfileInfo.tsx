
import React, { Fragment } from 'react';
import bg from "../routes/1500x500.jpeg";
import avatar from "../routes/mjv-d5z8_400x400.jpg";
import FollowButton from './FollowButton/FollowButton';
function ProfileInfo() {
  return (
    <Fragment>
      <header className="top-bar px-3 py-2">
        <span className=" m-3">
          <a href="http://">
            <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
          </a>
        </span>
        <div>
          <p className="font-extrabold text-lg ">Toka</p>
          <p className="p--light-color block ">20 tweet</p>
        </div>
      </header>
      <div className="pf--container">
        <div className="pf--bg" >
          <img src={bg} alt="avatar" />
        </div>
        <div className="pf--avatar">
          <img src={avatar} alt="avatar" />
        </div>

        <div className="pf--info">
          <div className="pf--flw-btn-div p-4 ">
            <FollowButton id="1" py="py-1.5" following={false} /></div>
          <div className="mx-2 ">
            <p className="font-extrabold text-lg">Toka Abdulhamied</p>
            <p className="p--light-color block">@tokaabdulhamied</p>
            <p>Bio</p>
            <div className="p--light-color">
              <span className="pr-2"><i className="fa fa-map-marker" aria-hidden="true"></i> Egypt ... cairo</span>
              <span className="px-2" ><i className="fa fa-gift" aria-hidden="true"></i> Born 9 January 1998 </span>
              <span className="px-2"><i className="fa fa-calendar" aria-hidden="true"></i> Joined December 2013</span>
            </div>
            <div className="font-bold">
              <a href="/"> 20 <span className="p--light-color mr-4 ">Following</span> </a>
              <a href="/">30 <span className="p--light-color mr-4">Follower</span> </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProfileInfo;