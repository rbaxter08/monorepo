import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${process.env.GIT_TOKEN}`,
  },
});

/**
 * Endpoint for making authenticated gql requests to the github api
 */
export default async function handler(req: any, res: any) {
  console.log(req.body);
  if (req.body.query) {
    const resp = await client.query({
      query: gql`
        ${req.body.query}
      `,
      variables: req.body.variables,
    });
    console.log(resp);
    return res.status(200).json(resp);
  }

  return res.status(500).json('GQL query required');
}
