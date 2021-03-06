import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { parseJwt } from './common/utils/jwtDecoder';
import { Routing } from './routes/routing';
import { apolloClient } from "./common/apolloClient";

var token;
var decodedToken1;
if (localStorage.getItem('token')) {
  token = localStorage.getItem('token')
  token ? decodedToken1 = parseJwt(token) : decodedToken1 = null
}
const client = apolloClient
export const decodedToken = decodedToken1

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </ApolloProvider>
  );
}
export default App;
