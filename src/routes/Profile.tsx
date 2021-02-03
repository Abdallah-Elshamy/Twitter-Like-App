import React, { Fragment } from 'react';
<<<<<<< HEAD
import '../App.css';
import '../styles/profile.css';
import ProfileInfo from "../components/ProfileInfo"; 
import { SideBar } from "./../components/sideBar/sideBar" ;
import Tweet from "../components/Tweet"
=======
import { SideBar } from "./../components/sideBar/sideBar" ;
import '../App.css';
import '../styles/layout.css'
>>>>>>> 7cd5b571fdc14599d5f43ce269388f77d66dbca7

function Profile() {
  return (
    <Fragment>
        <main className="main-container">
<<<<<<< HEAD
        <aside className="sb-left"><SideBar /></aside>  
        <article className="wall">
          <ProfileInfo/>
          <nav >
            <ul className="pf--nav-ul active">
              <li>
                <a href="/">Tweets</a>
              </li>
              <li>
                <a href="/">Tweets & replies</a>
              </li>
              <li>
                <a href="/">Media</a>
              </li>
              <li>
                <a href="/">Likes</a>
              </li>
            </ul>
          </nav>
          <div className="tweets">
            <Tweet/>
            <Tweet/>
          </div>
          </article>
          <aside className="sb-right">right</aside>
=======
          <aside className="sb-left"> <SideBar /> </aside>
           <article className="wall"></article>
          <aside className="sb-right"></aside>
>>>>>>> 7cd5b571fdc14599d5f43ce269388f77d66dbca7
          
        </main>
    </Fragment>
  );
}

export default Profile;