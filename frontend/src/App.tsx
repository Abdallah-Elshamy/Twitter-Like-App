import React from 'react';
import './App.css';
import './components/profile/Profile'
import { ApolloClient, ApolloProvider, HttpLink, NormalizedCacheObject, ApolloLink, createHttpLink } from '@apollo/client';
import Profile from './components/profile/Profile';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Explore from './routes/Explore';
import { cache } from './common/cache';
import { setContext } from '@apollo/client/link/context';
import { parseJwt } from './common/utils/jwtDecoder';
import { BrowserRouter as Router } from "react-router-dom";
import { Routing } from './routes/routing';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkVzbGFtIDEiLCJlbWFpbCI6ImVzbGFtQGhvdG1haWwuY29tIiwidXNlck5hbWUiOiJlc2xhbSIsImltYWdlVVJMIjpudWxsLCJjb3ZlckltYWdlVVJMIjpudWxsLCJiaXJ0aERhdGUiOiIxOTkxLTAyLTIyIiwiY3JlYXRlZEF0IjoiMjAyMS0wMi0wN1QwMTozNjo1MS40MzhaIiwidXBkYXRlZEF0IjoiMjAyMS0wMi0wN1QwMTozNjo1MS40MzhaIiwiaWF0IjoxNjEyNjYzMzAxfQ.vmiFfYjZOSQbfJigAsnUMff_bFKLV_NBj3B0iyuZ_aw"
 const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
}); 

const link = createHttpLink({
  uri: 'http://localhost:8000/graphql',
  credentials: 'same-origin'
});



const client = new ApolloClient({
  cache: cache,
  link,
});

export const decodedToken = parseJwt(token)

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routing />

      </BrowserRouter>
    </ApolloProvider>
  );
}
/* routes {
  Profile 
  Login
  Signup 
  LandingPage
  Home 
  User
  Tweet
  Explore
  Hashtg
} */
export default App;
