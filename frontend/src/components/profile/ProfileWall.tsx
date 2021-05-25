import { Fragment, useState } from 'react';
import '../../App.css';
import './profile.css';
import ProfileInfo from "./ProfileInfo";
import '../../styles/layout.css'
import { useQuery } from '@apollo/client';
import { LoggedUser } from '../../common/queries/Userqery';
import TweetList from '../tweets/TweetList'
import { Switch, NavLink, Route, useLocation, useRouteMatch } from "react-router-dom"
import { parseJwt } from '../../common/decode';
import Loading from "../../UI/Loading"
import FoF from '../../UI/FoF/FoF';


function ProfileWall() {
  let self = false;
  let ID: string;
  let profile;
  if (localStorage.getItem('token')) {
    profile = parseJwt(localStorage.getItem('token'))
  }

  const location = useLocation()
  console.log(location.pathname.substr(1))
  const match = useRouteMatch();
  const path = location.pathname.substr(1)
  const lastIndex = location.pathname.lastIndexOf('/')
  let urlId = path


  if (lastIndex !== 0) urlId = urlId.substr(0, lastIndex - 1)
  if (urlId === 'profile' ||
    (profile && urlId == profile.id)) {
    ID = profile.id; self = true;
  }
  else ID = urlId


  const { data, loading, error } = useQuery(LoggedUser, { variables: { id: ID } });
  const [tweetsPage, setTweetsPage] = useState<any>(1);
  const [tweetsRepliesPage, setTweetsRepliesPage] = useState<any>(1);
  const [mediaPage, setMediaPage] = useState<any>(1);
  const [likesPage, setLikesPage] = useState<any>(1);

  if (loading) return (<div className="mt-8" ><Loading /></div>)
  if (error) return <FoF
    msg="This account doesn’t exist"
    secMsg="try search for another"
  />
  return (
    < Fragment >
      <ProfileInfo user={data.user} self={self} />

      <nav >
        <ul className="pf--nav-ul ">
          <NavLink exact activeClassName="active" className="pf--nav-link" to={match.url}>
            <li>Tweets</li>
          </NavLink>
          <NavLink activeClassName="active" className="pf--nav-link" to={match.url + '/replies'}>
            <li>Tweets & replies</li>
          </NavLink>

          <NavLink activeClassName="active" className="pf--nav-link" to={match.url + '/media'}>
            <li>Media</li>
          </NavLink>
          <NavLink activeClassName="active" className="pf--nav-link" to={match.url + '/likes'}>
            <li>Likes</li>
          </NavLink>
        </ul>
      </nav>
      <div className="tweets">
        <Switch>
          <Route
            exact
            path={match.url}
            render={() => (
              <TweetList filter={``} page={tweetsPage} setPage={setTweetsPage} id={ID} />
            )}
          />
          <Route
            exact
            path={match.url + '/replies'}
            render={() => (
              <TweetList filter={`replies&tweets`} page={tweetsRepliesPage} setPage={setTweetsRepliesPage} id={ID} />
            )}
          />
          <Route
            exact
            path={match.url + '/media'}
            render={() => (
              <TweetList filter={`media`} page={mediaPage} setPage={setMediaPage} id={ID} />
            )}
          />
          <Route
            exact
            path={match.url + '/likes'}
            render={() => (
              <TweetList filter={`likes`} page={likesPage} setPage={setLikesPage} id={ID} />
            )}
          />
        </Switch>



      </div>


    </Fragment >
  );
}

export default ProfileWall;