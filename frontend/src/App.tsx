import React from 'react';
import './App.css';
import './routes/Profile'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Profile from './routes/Profile';
import { BrowserRouter } from 'react-router-dom';

const client = new ApolloClient ({
  uri: 'http://localhost:8000/graphql',
  // uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});

client
  .query({
    query: gql`
      query oyrfris {
 user(id:1){
  userName
  id
  name
}
}
    `
  })
  .then(result => console.log(result));

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
      <Profile />
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
