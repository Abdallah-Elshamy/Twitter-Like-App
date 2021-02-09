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
import {Switch, Link, Route} from "react-router-dom"


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
                <Link to="/">Tweets</Link>
              </li>
              <li>
                <Link to="/replies">Tweets & replies</Link>
              </li>
              <li>
                <Link to="/media">Media</Link>
              </li>
              <li>
                <Link to="/likes">Likes</Link>
              </li>
            </ul>
          </nav>
          <div className="tweets">
            <Switch>
            <Route
              exact
              path='/'
              render={ ()=> (
                <TweetList filter={``}/>
              )}
            />
            <Route
              exact
              path='/replies'
              render={() => (
                <TweetList  filter={`replies&tweets`} />
              )}
            />
            <Route
              exact
              path='/media'
              render={() => (
                <TweetList  filter={`media`} />
              )}
            />
            <Route
              exact
              path='/likes'
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