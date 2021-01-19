import {Sequelize} from 'sequelize-typescript';
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
    HasHashtag
} from '../models'

const db: Sequelize = new Sequelize(process.env.DATABASE_URI!, {
    logging: false
});

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
    HasHashtag
])

export default db;