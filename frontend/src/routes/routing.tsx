import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import { NotFoundPage } from '../components/notFound/notFound';
import { LandingPage } from '../components/Register/landingPage/landingPage';
import { Login } from '../components/Register/login_form/login';
import { SignUpForm } from '../components/Register/signup_form/signup';
import Explore from './Explore';
import Profile from '../components/profile/Profile';
import  Home  from "../components/Home";
// import {  useQuery } from '@apollo/client';
// import {LoggedUser} from '../common/queries/Userqery'; 
// import { parseJwt } from '../common/decode';
// import {User} from '../common/TypesAndInterfaces'
// import {userVar} from "../common/cache"
// import Loading from '../UI/Loading'

export const Routing: React.FC = () => {
  // asigning the user local var 
  return (
  <div>
    
    <Switch>

      <Route path="/SignUp">
        <SignUpForm />
      </Route>

      <Route path="/setting">
        <Setting />
      </Route>

      <Route path="/error">
        <NotFoundPage />
      </Route>

      <Route path="/forget_password">
        <ForgetPassword />
      </Route>


      <Route path="/explore">
        <Explore />
      </Route>

      <Route path="/messages">
        <Messages />
      </Route>


      <Route path="/LandingPage">
        <LandingPage />
      </Route>


      <Route path="/Notifications">
        <Notifications />
      </Route>

      <Route path="/login">
        <Login />
      </Route>

      <Route path="/" exact >
      <Home/>
      </Route>

      <Route path="/Messages">
        <Messages />
      </Route>

      <Route path="/profile">
        <Profile />
      </Route>


    </Switch>
  </div>
  )}

function Setting() {
  return <h2>setting</h2>;
}

function Messages() {
  return <h2>Messages</h2>;
}
function Notifications() {
  return <h2>Notifications</h2>;
}

function ForgetPassword() {
  return <h2>forget_password</h2>;
}
