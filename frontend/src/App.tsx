import React from 'react';
import './App.css';
import './routes/Profile'
import {ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

import { parseJwt } from './common/utils/jwtDecoder';

import { Routing } from './routes/routing';
import { clientLog } from './components/Register/login_form/login';

var token ;
if (localStorage.getItem('token') !== '')
{
  token = localStorage.getItem('token')
}
const client = clientLog
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
export default App;
