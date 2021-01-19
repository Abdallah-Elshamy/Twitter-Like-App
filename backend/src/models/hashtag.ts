import {
    Table, 
    Column, 
    Model, 
    PrimaryKey,
    DataType, 
    BelongsToMany
} from 'sequelize-typescript';
import Tweet from './tweet'
import HasHashtag from './hasHashtag'

@Table({
    timestamps: true,
    tableName: 'hashtags',
})
class Hashtag extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    word!: string;

    // many-to-many relation between hastag and tweet through hasHashtag
    @BelongsToMany(() => Tweet, () => HasHashtag, 'tweetId', 'hashtag')
    tweets?: Tweet[];
}


export default Hashtag;