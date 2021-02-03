import React from 'react';
import './App.css';
import './routes/Profile'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Profile from './routes/Profile';
import { BrowserRouter, Switch,Route } from 'react-router-dom';
import Explore from './routes/explore';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  // uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});



function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
      <Switch>
        <Route path="/explore">
          <Explore />
        </Route>
      <Profile />
</Switch>
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
