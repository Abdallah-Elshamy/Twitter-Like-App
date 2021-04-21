import { PubSub } from "apollo-server-express";
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
            subscribe: () => pubsub.asyncIterator(["MESSAGE_SENT"]),
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
