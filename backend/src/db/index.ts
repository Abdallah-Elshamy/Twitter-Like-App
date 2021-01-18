import {Sequelize} from 'sequelize';

const db: Sequelize = new Sequelize(process.env.DATABASE_URI!, {
    logging: false
});
export default db;