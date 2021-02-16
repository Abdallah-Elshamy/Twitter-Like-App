import React, { Fragment } from 'react';
import { SideBar } from "../sideBar/sideBar";
import '../../App.css';
import './profile.css';
import ProfileInfo from "./ProfileInfo"; 
import TrendsBar from '../TrendsBar/TrendsBar';
import '../../styles/layout.css'
import {  useQuery } from '@apollo/client';
import {LoggedUser} from '../../Userqery'; 
import TweetList from '../tweets/TweetList'
// import Tweets from "../components/TweetList"
import {Switch, NavLink, Route} from "react-router-dom"


function Profile() {
  
  const {loading,error,data} = useQuery(LoggedUser); 
  if (loading) return <p>'Loading .. '</p> 
  if (error) return <p>`Error! ${error.message}`</p> 
  return (
    <Fragment>
      <main className="main-container">
        <aside className="sb-left"><SideBar /></aside>
        <article className="wall">
          <ProfileInfo />
          <nav >
            <ul className="pf--nav-ul ">
              <NavLink exact activeClassName="active" className="pf--nav-link" to="/profile">
                <li>Tweets</li>
              </NavLink>
              <NavLink activeClassName="active" className="pf--nav-link"  to="/profile/replies">
                <li>Tweets & replies</li>
              </NavLink>

              <NavLink activeClassName="active" className="pf--nav-link" to="/profile/media">
                <li>Media</li>
              </NavLink>
              <NavLink activeClassName="active" className="pf--nav-link"  to="/profile/likes">
                <li>Likes</li>
              </NavLink>
            </ul>
          </nav>
          <div className="tweets">
            <Switch>
            <Route
              exact
              path='/profile'
              render={ ()=> (
                <TweetList filter={``}/>
              )}
            />
            <Route
              exact
              path='/profile/replies'
              render={() => (
                <TweetList  filter={`replies&tweets`} />
              )}
            />
            <Route
              exact
              path='/profile/media'
              render={() => (
                <TweetList  filter={`media`} />
              )}
            />
            <Route
              exact
              path='/profile/likes'
              render={() => (
                <TweetList filter={`likes`} />
              )}
            />
            </Switch>

  
            
          </div>
        </article>
        <aside className="sb-right"><TrendsBar /></aside>

      </main>
    </Fragment>
  );
}

export default Profile;