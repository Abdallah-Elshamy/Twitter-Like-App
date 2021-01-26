import React, { Fragment } from 'react';
import bg from "../routes/1500x500.jpeg";
import avatar from "../routes/mjv-d5z8_400x400.jpg"; 




function ProfileInfo() {
  return (
    <Fragment>
      <header className=" h-12 items-center px-4 top-bar">
        <span className="mr-6">
          <a href="http://">
            <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
          </a>
        </span>
        <div>
          <p className="font-extrabold text-lg ">Toka</p>
          <p className="p--light-color block ">20 tweet</p>
        </div>
      </header>
      <div className="flex flex-col relative">
        <img  className="pf--bg" src={bg} alt="backGround"/>
        <img className="pf--avatar" src={avatar} alt="avatar"/>
        <div className="relative">
          <button className="pf--follow-btn rounded-full font-bold">Follow</button>
        </div>  
        <div className="mx-2 mt-12">

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
          </Fragment>
  );
}

export default ProfileInfo;