import React, { Fragment } from 'react';
import '../App.css';
import '../styles/profile.css';
import ProfileInfo from "../components/ProfileInfo"; 

function Profile() {
  return (
    <Fragment>
        <main className="main-container">
        <aside className="sb-left">left</aside>  
        <article className="wall">
          <ProfileInfo/>
          <nav>
            <ul className="pf--nav-ul">
              <li>
                <a href="#">Tweets</a>
              </li>
              <li>
                <a href="#">Tweets & replies</a>
              </li>
              <li>
                <a href="#">Media</a>
              </li>
              <li>
                <a href="#">Likes</a>
              </li>
            </ul>
          </nav>

          </article>
          <aside className="sb-right">right</aside>
          
        </main>
    </Fragment>
  );
}

export default Profile;