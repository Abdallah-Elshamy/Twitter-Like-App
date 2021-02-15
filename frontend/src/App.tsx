import React from 'react';
import './App.css';
import './routes/Profile'
import { ApolloClient, ApolloProvider, HttpLink, NormalizedCacheObject, ApolloLink, createHttpLink } from '@apollo/client';
import Profile from './routes/Profile';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Explore from './routes/Explore';
import { cache } from './common/cache';
import { setContext } from '@apollo/client/link/context';
import { parseJwt } from './common/utils/jwtDecoder';
import { BrowserRouter as Router } from "react-router-dom";
import { Routing } from './routes/routing';

const token = localStorage.getItem('token')
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
