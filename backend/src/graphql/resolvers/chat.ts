import { PubSub, withFilter } from "apollo-server-express";
import { User } from "../../models";

const pubsub = new PubSub();

interface ChatMessage {
    from: User;
    to: User;
    message: String;
}

export default {
    Subscription: {
        messageSent: {
            // More on pubsub below
            subscribe: withFilter(
                () => pubsub.asyncIterator(["MESSAGE_SENT"]),
                (payload: any, args: any, context: any) => {
                    return payload.messageSent.to.id === context.connection.context.id;
                }
            ),
        },
    },
    Mutation: {
        sendMessage: async (
            parent: any,
            args: {
                message: {
                    toUserId: number;
                    messageBody: string;
                };
            },
            context: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }

            const from: User = user;
            const to = await User.findByPk(args.message.toUserId);
            if (!to) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            const payload: ChatMessage = {
                from,
                to,
                message: args.message.messageBody,
            };

            pubsub.publish("MESSAGE_SENT", {
                messageSent: payload,
            });
            return payload;
        },
    },
};
