import React from 'react';
import './App.css';
import './routes/Profile'
import { ApolloClient, ApolloProvider, HttpLink, NormalizedCacheObject, ApolloLink } from '@apollo/client';
import Profile from './routes/Profile';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Explore from './routes/Explore';
import { cache } from './common/cache';
import { setContext } from '@apollo/client/link/context';
import { parseJwt } from './common/utils/jwtDecoder';


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkVzbGFtIDEiLCJlbWFpbCI6ImVzbGFtQGhvdG1haWwuY29tIiwidXNlck5hbWUiOiJlc2xhbSIsImltYWdlVVJMIjpudWxsLCJjb3ZlckltYWdlVVJMIjpudWxsLCJiaXJ0aERhdGUiOiIxOTkxLTAyLTIyIiwiY3JlYXRlZEF0IjoiMjAyMS0wMi0wN1QwMTozNjo1MS40MzhaIiwidXBkYXRlZEF0IjoiMjAyMS0wMi0wN1QwMTozNjo1MS40MzhaIiwiaWF0IjoxNjEyNjYzMzAxfQ.vmiFfYjZOSQbfJigAsnUMff_bFKLV_NBj3B0iyuZ_aw"

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const httpLink = new HttpLink({ uri: 'http://localhost:8000/graphql', })
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({

  link: authLink.concat(httpLink),
  cache: cache,

});

export const decodedToken = parseJwt(token)

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
