import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider , createHttpLink } from '@apollo/client';
import { BrowserRouter as Router} from "react-router-dom";

import { Routing } from './routes/routing';


const link = createHttpLink({
    // uri: 'http://localhost:8000',
  uri: 'http://localhost:8000/graphql',
  credentials: 'same-origin'
});

const client = new ApolloClient ({
  cache: new InMemoryCache(),
  link,
});

function App() {
  return (
    <ApolloProvider client={client}>
     <Router>
        <Routing />
     </Router>
   </ApolloProvider>
  );
}

export default App;
