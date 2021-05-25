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
import AdminDashBoard from "../components/Admin/AdminDashBoard"
import Home from "../components/Home";
import { Login } from "../components/Register/login_form/login";
import {parseJwt} from '../common/utils/jwtDecoder'
import ExtendedTweet from "../components/tweets/ExtendedTweet/ExtendedTweet";
import FollowWall from "../components/profile/FollowWall";

export const Routing = () => {
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

        <PrivateRoute path="/profile/following">
          <FollowWall   FollowType = "following" />
        </PrivateRoute>

        <PrivateRoute path="/profile/follower">
        <FollowWall FollowType ='follower' />
        </PrivateRoute>

        <Route path='/:id/following'>
        <FollowWall   FollowType = "following" />
        </Route>

        <Route path='/:id/follower'>
        <FollowWall FollowType ='follower' />
        </Route>

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

        <AdminRoute path="/admin">
          <AdminDashBoard />
        </AdminRoute>
        <PrivateRoute path="/Notifications">
          <Notifications />
        </PrivateRoute>


        <PrivateRoute path="/" exact >
          <Home />
        </PrivateRoute>


        <PrivateRoute path="/tweet/:id">
          <ExtendedTweet />
        </PrivateRoute>

        <PrivateRoute path="/profile">
          <Profile />
        </PrivateRoute>

        <Route path='/:id'>
          <Profile />
        </Route>

      </Switch>

    </div>
  )
};

const PrivateRoute = ({ children, ...rest }: any) => {
  let auth = localStorage.getItem('token') ? true : false
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
  let auth = localStorage.getItem('token') ? false : true
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

const AdminRoute = ({ children, ...rest }: any) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <Route
        {...rest}
        render={({ location}) => 
        (
          <Redirect to={{
            pathname: "/login",
            state: { from: location }
          }}
          />
        )
        }
      />
      
    )
  }
  const user = parseJwt(token)
  const isAdmin = user.isAdmin
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAdmin ? (
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
