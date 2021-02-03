import React from 'react';

import './App.css';
import './routes/Profile'
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import Profile from './routes/Profile';




const client = new ApolloClient ({
  uri: 'http://localhost:8000',
  // uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>

      <Profile/>
    </ApolloProvider>
  );
}

export default App;
