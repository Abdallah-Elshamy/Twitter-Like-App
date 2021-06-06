import { withFilter } from "apollo-server-express";
import { User } from "../../models";
import pubsub from "../../messaging";
import db from "../../db";
import { ChatMessage } from "../../models";
import { Op, QueryTypes } from "sequelize";
import sequelize from "sequelize";

const PAGE_SIZE = 20;

export default {
  Subscription: {
    messageSent: {
      // More on pubsub below
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MESSAGE_SENT"]),
        (payload: any, args: any, context: any) => {
          return payload.messageSent.to === context.connection.context.id;
        }
      ),
    },
  },
  Query: {
    getChatHistory: async (
      parent: any,
      args: { otherUserId: number; page: number },
      context: any,
      info: any
    ) => {
      const { user, authError } = context.req;
      if (authError) {
        throw authError;
      }

      const { otherUserId, page } = args;

      if (!(await User.findByPk(otherUserId))) {
        const error: any = new Error("No user was found with this id!");
        error.statusCode = 404;
        throw error;
      }

      const searchConditions = {
        where: {
          [Op.or]: [
            {
              from: user.id,
              to: otherUserId,
            },
            {
              to: user.id,
              from: otherUserId,
            },
          ],
        },
      };
      return {
        messages: await ChatMessage.findAll({
          ...searchConditions,
          offset: ((page || 1) - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: [["createdAt", "DESC"]],
        }),
        totalCount: ChatMessage.count(searchConditions),
      };
    },
    getUnseenMessages: async (
      parent: any,
      args: { page: number },
      context: any,
      info: any
    ) => {
      const { user, authError } = context.req;
      if (authError) {
        throw authError;
      }
      const searchConditions = {
        where: {
          to: user.id,
          isSeen: false,
        },
      };
      return {
        messages: await ChatMessage.findAll({
          ...searchConditions,
          offset: ((args.page || 1) - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: [["createdAt", "DESC"]],
        }),
        totalCount: ChatMessage.count(searchConditions),
      };
    },
    getConversationHistory: async (
      parent: any,
      args: { page: number },
      context: any,
      info: any
    ) => {
      const { user, authError } = context.req;
      if (authError) {
        throw authError;
      }

      const { page } = args;

      const pairSearchConditions = {
        where: {
          [Op.or]: [
            {
              from: user.id,
            },
            {
              to: user.id,
            },
          ],
        },
      };

      const conversation_pairs = await ChatMessage.findAll({
        attributes: [
          "from",
          "to",
          [sequelize.fn("max", sequelize.col("createdAt")), "lastMessageTime"],
        ],
        group: ["from", "to"],
        ...pairSearchConditions,
        offset: ((page || 1) - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        order: [[sequelize.col("lastMessageTime"), "DESC"]],
      });

      const countQueryResults = await db.query(
        `SELECT COUNT(*) FROM
         (SELECT distinct "from", "to" 
         FROM "chatMessage" 
         WHERE "to" = ${user.id} OR "from" = ${user.id}) AS conversations`,
        { type: QueryTypes.SELECT }
      );

      const totalCount: number = Object.values(countQueryResults[0])[0];

      return {
        conversations: conversation_pairs.map(async (pair) => {
          const otherUserId = user.id === pair.from ? pair.to : pair.from;
          const conversationSearchConditions = {
            where: {
              [Op.or]: [
                {
                  to: otherUserId,
                  from: user.id,
                },
                {
                  from: otherUserId,
                  to: user.id,
                },
              ],
            },
          };
          return {
            with: await User.findByPk(otherUserId),
            unseenMessageCount: await ChatMessage.count({
              where: {
                from: otherUserId,
                to: user.id,
                isSeen: false,
              },
            }),
            lastMessage: await ChatMessage.findOne({
              ...conversationSearchConditions,
              order: [["createdAt", "DESC"]],
            }),
          };
        }),
        totalCount,
      };
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

      // Disable publishing events in the test environment
      if (!process.env.TEST_ENVIROMENT) {
        pubsub.publish("MESSAGE_SENT", {
          messageSent: message,
        });
      }

      return message;
    },
    setMessageSeen: async (
      parent: any,
      args: {
        messageId: number;
      },
      context: any
    ) => {
      const { user, authError } = context.req;
      if (authError) {
        throw authError;
      }

      const message = await ChatMessage.findByPk(args.messageId);
      if (!message) {
        const error: any = new Error("No message was found with this id!");
        error.statusCode = 404;
        throw error;
      }

      if (message.to !== user.id) {
        const error: any = new Error("This message was sent to another user!");
        error.statusCode = 400;
        throw error;
      }

      const toBeUpdatedMessage: ChatMessage = message;
      toBeUpdatedMessage.isSeen = true;

      await db.transaction(async (transaction) => {
        return await toBeUpdatedMessage.save({ transaction });
      });

      return true;
    },
    setAllMessagesFromUserSeen: async (
      parent: any,
      args: {
        userId: number;
      },
      context: any
    ) => {
      const { user, authError } = context.req;
      if (authError) {
        throw authError;
      }

      const fromUser = await User.findByPk(args.userId);
      if (!fromUser) {
        const error: any = new Error("No user was found with this id!");
        error.statusCode = 404;
        throw error;
      }

      await db.transaction(async (transaction) => {
        return await ChatMessage.update(
          {
            isSeen: true,
          },
          {
            where: {
              from: fromUser.id,
              to: user.id,
              isSeen: false,
            },
            transaction,
          }
        );
      });

      return true;
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
