import { withFilter } from "apollo-server-express";
import { User } from "../../models";
import pubsub from "../../messaging";
import db from "../../db";
import { ChatMessage } from "../../models";

export default {
    Subscription: {
        messageSent: {
            // More on pubsub below
            subscribe: withFilter(
                () => pubsub.asyncIterator(["MESSAGE_SENT"]),
                (payload: any, args: any, context: any) => {
                    return (
                        payload.messageSent.to ===
                        context.connection.context.id
                    );
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

            if (args.message.messageBody.length === 0) {
                const error: any = new Error("The message is empty!");
                error.statusCode = 400;
                throw error;
            }

            const message = await db.transaction(async (transaction) => {
                return await ChatMessage.create(
                    {
                        from: from.id,
                        to: to.id,
                        message: args.message.messageBody,
                    },
                    { transaction }
                );
            });

            pubsub.publish("MESSAGE_SENT", {
                messageSent: message,
            });
            return message;
        },
    },
    ChatMessage: {
        from: async (parent: ChatMessage) => {
            return await User.findByPk(parent.from);
        },
        to: async (parent: ChatMessage) => {
            return await User.findByPk(parent.to);
        },
    },
};
