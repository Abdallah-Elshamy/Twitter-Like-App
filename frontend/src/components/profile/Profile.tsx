import React, { Fragment } from 'react';
import { SideBar } from "../sideBar/sideBar";
import '../../App.css';
import './profile.css';
import TrendsBar from '../TrendsBar/TrendsBar';
import '../../styles/layout.css'
import ProfileWall from './ProfileWall';

function Profile() {

  return (
    <Fragment>

      <main className="main-container">
        <aside className="sb-left">< SideBar /></aside>
        <article className="wall">
          <ProfileWall/>
          </article>
        <aside className="sb-right">< TrendsBar /></aside>

      </main>
   
    </Fragment>
  );
}

export default Profile;