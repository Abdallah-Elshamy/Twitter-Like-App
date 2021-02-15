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
import Profile from './Profile';


export const Routing: React.FC = () => (
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
        <Profile />
      </Route>

      <Route path="/Messages">
        <Messages />
      </Route>

      <Route path="/profile">
        <Profile />
      </Route>


    </Switch>
  </div>
);



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
