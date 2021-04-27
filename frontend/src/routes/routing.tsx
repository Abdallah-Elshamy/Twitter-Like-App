import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { NotFoundPage } from '../components/notFound/notFound';
import { LandingPage } from '../components/Register/landingPage/landingPage';
import { SignUpForm } from '../components/Register/signup_form/signup';
import Explore from './Explore';
import Profile from '../components/profile/Profile';
import Home from "../components/Home";
import { useQuery } from '@apollo/client';
import { GET_ISAUTH } from '../common/queries/Get_isAuth';
import { Login } from "../components/Register/login_form/login";

export const Routing = () => {
  // let auth = useQuery(GET_ISAUTH).data.authenticated


  return (
    <div>

      <Switch>
        <PublicRoute path="/signup">
          <SignUpForm />
        </PublicRoute>

        <PublicRoute path="/login">
          <Login />
        </PublicRoute>

        <PrivateRoute path="/setting">
          <Setting />
        </PrivateRoute>

        <Route path="/error">
          <NotFoundPage />
        </Route>

        <PublicRoute path="/forget_password">
          <ForgetPassword />
        </PublicRoute>


        <Route path="/explore">
          <Explore />
        </Route>

        <PrivateRoute path="/messages">
          <Messages />
        </PrivateRoute>


        <PublicRoute path="/LandingPage">
          <LandingPage />
        </PublicRoute>


        <PrivateRoute path="/Notifications">
          <Notifications />
        </PrivateRoute>


        <PrivateRoute path="/" exact >
          <Home />
        </PrivateRoute>


        <PrivateRoute path="/profile">
          <Profile />
        </PrivateRoute>


      </Switch>
    </div>
  )
};


const PrivateRoute = ({ children, ...rest }: any) => {
  let auth = useQuery(GET_ISAUTH).data.authenticated
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const PublicRoute = ({ children, ...rest }: any) => {
  let auth = !useQuery(GET_ISAUTH).data.authenticated
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


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
