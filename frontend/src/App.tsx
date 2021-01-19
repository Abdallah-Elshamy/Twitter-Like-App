import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000',
  cache: new InMemoryCache()
});
function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App">
      <h1 className="text-red-500">oh hi, that was boring </h1>
    </div>
    </ApolloProvider>
  );
}
      /* routes {
        Profile 
        Logein
        Signup 
        Home 
        User
        Tweet
        Explore
        Hashtg
      } */
export default App;
