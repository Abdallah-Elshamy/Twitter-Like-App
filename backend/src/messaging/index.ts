import { AmqpPubSub } from "graphql-rabbitmq-subscriptions";
import * as Logger from "bunyan";

const logger: Logger = Logger.createLogger({ name: "Twitter-Like-App" });

const pubsub = new AmqpPubSub({
    config: process.env.RABBIT_MQ_URI,
    logger,
});

export default pubsub;
