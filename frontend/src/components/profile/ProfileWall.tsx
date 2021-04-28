import React, { Fragment, useState } from 'react';
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
  let profile;
  if (localStorage.getItem('token')) {
    profile = parseJwt(localStorage.getItem('token'))
  }

  const { loading, error } = useQuery(LoggedUser, { variables: { id: profile.id } });
  const [tweetsPage, setTweetsPage] = useState<any>(1);
  const [tweetsRepliesPage, setTweetsRepliesPage] = useState<any>(1);
  const [mediaPage, setMediaPage] = useState<any>(1);
  const [likesPage, setLikesPage] = useState<any>(1);

  if (loading) return (<div className="mt-8" ><Loading /></div>)
  if (error) return <p>`Error! ${error.message}`</p>
  return (
    < Fragment >
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
              <TweetList filter={``} page={tweetsPage} setPage={setTweetsPage} />
              // to test paganation go to profileWallPage
              // <Profilewallpage  filter={``}/>
            )}
          />
          <Route
            exact
            path='/profile/replies'
            render={() => (
              <TweetList filter={`replies&tweets`} page={tweetsRepliesPage} setPage={setTweetsRepliesPage}/>
            )}
          />
          <Route
            exact
            path='/profile/media'
            render={() => (
              <TweetList filter={`media`} page={mediaPage} setPage={setMediaPage}/>
            )}
          />
          <Route
            exact
            path='/profile/likes'
            render={() => (
              <TweetList filter={`likes`} page={likesPage} setPage={setLikesPage}/>
            )}
          />
        </Switch>



      </div>


    </Fragment >
  );
}

export default ProfileWall;