import React, { Fragment } from 'react';
import { SideBar } from "./../components/sideBar/sideBar" ;
import '../App.css';
import '../styles/layout.css'

function Profile() {
  return (
    <Fragment>
        <main className="main-container">
          <aside className="sb-left"> <SideBar /> </aside>
           <article className="wall"></article>
          <aside className="sb-right"></aside>
          
        </main>
    </Fragment>
  );
}

export default Profile;