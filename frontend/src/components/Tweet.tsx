import React from 'react';
import '../styles/tweet.css';
import avatar from "../routes/mjv-d5z8_400x400.jpg"; 



function Tweet() {
  return (
      <div className="tweet-box">
        <div className="tweet-icon">
          <img src={avatar} alt="avatar"/>
        </div>
        <div className="tweet-aside">
          <div className="tweet-data">
            <p className="font-bold mr-1">Toka Abdulhamied</p>
            <p className="p--light-color"> @tokaabdulhamied</p>
            <p className="p--light-color">9 Jan</p>
            <span className="tweet-ellipsis p--light-color">
            <i className="fas fa-ellipsis-h"></i>
            </span>
          </div>
          <div className="tweet-content">
            <span>
                Learning to work with intensity when necessary and to rest when you've done enough might be the most important thing you can do for your lifestyle. Few things damage a lifestyle more than a never-ending slog.
            </span>
          
          <div className="tweet-toolbar p--light-color ">
            <a href="/">
            <i className="fas fa-reply"></i>
            <span>2</span>
            </a>
            <a href="/">
            <i className="fas fa-retweet"></i>
            <span>2</span>
            </a>
            <a href="/">
            <i className="far fa-heart"></i>
            <span>2</span>
            </a>
          </div>
          </div>
        </div>
      </div>
  );
}


export default Tweet;