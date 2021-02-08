import React, { Fragment } from 'react';
import { SideBar } from "./../components/sideBar/sideBar" ;
import '../App.css';
import '../styles/profile.css';
import ProfileInfo from "../components/ProfileInfo"; 
import TrendsBar from '../components/TrendsBar/TrendsBar';
import '../styles/layout.css'
import {  useQuery } from '@apollo/client';
import {LoggedUser} from '../Userqery'; 
import TweetList from '../components/TweetList'
// import Tweets from "../components/TweetList"



function Profile() {
  const {loading,error,data} = useQuery(LoggedUser); 
  if (loading) return <p>'Loading .. '</p> 
  if (error) return <p>`Error! ${error.message}`</p> 
  return (
    <Fragment>
        <main className="main-container">
        <aside className="sb-left"><SideBar/></aside>  
        <article className="wall">
          <ProfileInfo />
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
            
              <TweetList filter=""/>
            
          </div>
          </article>
          <aside className="sb-right"><TrendsBar /></aside>
          
        </main>
    </Fragment>
  );
}

export default Profile;