import { ApolloClient, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
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
export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache
});