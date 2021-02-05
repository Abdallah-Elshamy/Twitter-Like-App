import React from 'react';
import './App.css';
import './routes/Profile'
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import Profile from './routes/Profile';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Explore from './routes/Explore';
import { cache } from './common/cache';



const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  // uri: 'http://localhost:8000/graphql',
  cache: cache
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
