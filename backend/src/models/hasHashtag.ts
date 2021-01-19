import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    DataType,
} from 'sequelize-typescript';
import Hashtag from './hashtag'
import Tweet from './tweet'

@Table({
    tableName: 'hasHashtags'
})
class HasHashtag extends Model {
    @PrimaryKey
    @ForeignKey(() => Hashtag)
    @Column(DataType.STRING)
    hashtag!: string;

    @PrimaryKey
    @ForeignKey(() => Tweet)
    @Column(DataType.INTEGER)
    tweetId!: number;
}

export default HasHashtag;

