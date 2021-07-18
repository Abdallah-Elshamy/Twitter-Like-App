import { ApolloClient, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { cache } from "./cache";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
    uri: "http://localhost:8000/graphql",
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${localStorage.getItem("token") || null}`,
        },
    };
});

const wsLink: any = new WebSocketLink({
    uri: "ws://localhost:8000/subscriptions",
    options: {
        reconnect: false,
        connectionParams: () => {
            if (localStorage.getItem("token")) {
                return {
                    authToken: `Bearer ${
                        localStorage.getItem("token")}`,
                };
            }
        },
    },
});
export const changeSubscriptionToken = (token: any) => {
    if (wsLink.subscriptionClient.connectionParams.authToken === token) return;
    wsLink.subscriptionClient.connectionParams.authToken = token;
    wsLink.subscriptionClient.close();
    if (token !== null) {
        wsLink.subscriptionClient.connect();
    }
};

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
export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: cache,
});
