import { BrowserRouter as Router } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  fromPromise,
  split,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getNewToken } from "./utils/getNewToken";
import { onError } from "@apollo/client/link/error";

import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { policies } from "./utils/typePolices";
import { store } from "./app/store";

import AppRoutes from "./routes";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3001/graphql",
  })
);

const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const { user } = store.getState();
  const accessToken = user.access_token;

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions?.code) {
          case "UNAUTHENTICATED":
            return fromPromise(
              getNewToken().catch((error) => {
                return;
              })
            ).flatMap((accessToken) => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${accessToken}`,
                },
              });
              return forward(operation);
            });
        }
      }
    }
  }
);

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(policies),
  link: from([errorLink, splitLink]),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AppRoutes />
      </Router>
    </ApolloProvider>
  );
}

export default App;
