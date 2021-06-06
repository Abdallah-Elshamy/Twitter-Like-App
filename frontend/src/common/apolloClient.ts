import { ApolloClient, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {  cache } from './cache';

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql',
  });
  

const authLink = setContext((_, { headers }) => {
    return {
    headers: {
        ...headers,
        authorization: `Bearer ${localStorage.getItem('token') || null}`
    }
    }
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8000/subscriptions',
  options: {
    reconnect: true,
    connectionParams: {
        authToken: `Bearer ${localStorage.getItem('token') || null}`,
      },
  },
 
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: cache
});

