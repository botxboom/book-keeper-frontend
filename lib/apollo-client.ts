import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL;
console.log(uri);
console.log(uri?.toString());

if (!uri && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_GRAPHQL_URL is not defined in production!");
}

const httpLink = createHttpLink({
  uri: uri || "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
  },
});
