import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: '/api/github',
  cache: new InMemoryCache(),
});
