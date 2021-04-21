import { PubSub } from "apollo-server-express";

const pubsub = new PubSub();

export default {
    Subscription: {
        messageSent: {
            // More on pubsub below
            subscribe: () => pubsub.asyncIterator(["MESSAGE_SENT"]),
        },
    },
};
