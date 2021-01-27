import React from 'react';
import '../styles/tweet.css';





function Tweet() {
  return (
      <div className="tweet-box">
        <div className="tweet-icon">
          icon
        </div>
          <div className="tweet-wraber">
          <div className="tweet-data">
            <p>Toka Abdulhamied</p>
            <p>@tokaabdulhamied</p>
            <p>9 Jan</p>
            <span className="ellipsis">
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            </span>
          </div>
          <div className="tweet-content">content</div>
          <div className="tweet-toolbar ">
            <a href="#">
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            </a>
            <a href="#">
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            </a>
            <a href="#">
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            </a>
       

          </div>
        </div>
      </div>
  );
}


export default Tweet;