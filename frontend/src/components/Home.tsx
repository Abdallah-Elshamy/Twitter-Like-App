
import React, { Fragment } from 'react';
import { SideBar } from "./sideBar/sideBar";
import './../App.css';
import './profile/profile.css';
import TrendsBar from './TrendsBar/TrendsBar';
import './../styles/layout.css'
import HomeTweets from './tweets/HomeTweets';
import PostTweet from './tweets/PostTweet'
import { Chatpage } from './chat/chat';

function Home() {
  return (
    <Fragment>
      <main className="main-container">
        <aside className="sb-left"><SideBar /></aside>
        <article className="wall">
          <header className="top-bar px-3 py-2">
            <div className="font-bold text-lg">
              Home
        </div>

          </header>
          <PostTweet />
          <HomeTweets />
          {/* <Chatpage/> */}
        </article>
        <aside className="sb-right"><TrendsBar /></aside>

      </main>
    </Fragment>
  );
}

export default Home;