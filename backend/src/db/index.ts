import { Sequelize } from "sequelize-typescript";
import {
    Tweet,
    User,
    Group,
    Permission,
    Hashtag,
    Follows,
    HasPermission,
    UserBelongsToGroup,
    Likes,
    HasHashtag,
    ChatMessage,
} from "../models";

const db: Sequelize = new Sequelize(
    process.env.TEST_ENVIROMENT
        ? process.env.TEST_DATABASE_URI!
        : process.env.DATABASE_URI!,
    {
        logging: false,
    }
);

db.addModels([
    Tweet,
    User,
    Group,
    Permission,
    Hashtag,
    Follows,
    HasPermission,
    UserBelongsToGroup,
    Likes,
    HasHashtag,
    ChatMessage,
]);

export default db;
