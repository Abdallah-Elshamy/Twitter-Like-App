import React from 'react';

import './App.css';
import './routes/Profile'
import { ApolloClient, InMemoryCache, ApolloProvider , createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Profile from './routes/Profile';
import { Register } from "./components/Register/Register"
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
     <Router >
        <Routing />
     </Router>
   </ApolloProvider>
  );
}

export default App;



// to change the header 
// import React from 'react';
// import Header from '../components/Header'
// import { todoMutations } from '../operations/mutations';

// export default function () {
//   return <Header addTodo={todoMutations.addTodo} />;
// }