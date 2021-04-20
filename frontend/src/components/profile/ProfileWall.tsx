import React, { Fragment } from 'react';
import '../../App.css';
import './profile.css';
import ProfileInfo from "./ProfileInfo";
import '../../styles/layout.css'
import { useQuery } from '@apollo/client';
import { LoggedUser } from '../../common/queries/Userqery';
import TweetList from '../tweets/TweetList'
import { Switch, NavLink, Route } from "react-router-dom"
import { parseJwt } from '../../common/decode';
import Loading from "../../UI/Loading"


function ProfileWall() {
  var profile;
  if (localStorage.getItem('token') !== "LOGOUT" || localStorage.getItem('token') == null) {
    profile = parseJwt(localStorage.getItem('token'))
  }

  const { loading, error } = useQuery(LoggedUser, { variables: { id: profile.id } });
  if (loading) return (<div className="mt-8" ><Loading /></div>)
  if (error) return <p>`Error! ${error.message}`</p>
  return (
    <Fragment>
      <ProfileInfo />
      <nav >
        <ul className="pf--nav-ul ">
          <NavLink exact activeClassName="active" className="pf--nav-link" to="/profile">
            <li>Tweets</li>
          </NavLink>
          <NavLink activeClassName="active" className="pf--nav-link" to="/profile/replies">
            <li>Tweets & replies</li>
          </NavLink>

          <NavLink activeClassName="active" className="pf--nav-link" to="/profile/media">
            <li>Media</li>
          </NavLink>
          <NavLink activeClassName="active" className="pf--nav-link" to="/profile/likes">
            <li>Likes</li>
          </NavLink>
        </ul>
      </nav>
      <div className="tweets">
        <Switch>
          <Route
            exact
            path='/profile'
            render={() => (
              <TweetList filter={``} />
            )}
          />
          <Route
            exact
            path='/profile/replies'
            render={() => (
              <TweetList filter={`replies&tweets`} />
            )}
          />
          <Route
            exact
            path='/profile/media'
            render={() => (
              <TweetList filter={`media`} />
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


    </Fragment>
  );
}

export default ProfileWall;