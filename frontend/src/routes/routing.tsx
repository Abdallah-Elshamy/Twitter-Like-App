import React from 'react';
import {
    Switch,
    Route
  } from "react-router-dom";
import { LandingPage } from '../components/Register/landingPage/landingPage';
import { Login } from '../components/Register/login_form/login';
import { SignUpForm } from '../components/Register/signup_form/signup';
import Profile from './Profile';

interface Props {

}

export const Routing: React.FC <Props> = () =>  (
    <div>

    <Switch>

    <Route path="/SignUp">
        <SignUpForm />
      </Route>

      <Route path="/setting">
        <Setting />
      </Route>


      <Route path="/forget_password">
        <Forget_password/>
      </Route>


      <Route path="/Explore">
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

  function Explore() {
    return <h2>Explore</h2>;
  }
  

  function Messages() {
    return <h2>Messages</h2>;
  }

  function Notifications() {
    return <h2>Notifications</h2>;
  }
  
  function Forget_password() {
    return <h2>forget_password</h2>;
  }
  