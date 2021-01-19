import {Table, 
  Column, 
  Model, 
  PrimaryKey, 
  BelongsToMany
} from 'sequelize-typescript';
import Tweet from './tweet'
import HasHashtag from './hasHashtag'

@Table({
    timestamps: true,
    tableName: 'hashtags',
  })
  
export default class Hashtag extends Model {
  @Column
  @PrimaryKey
  word!: string;

  // many-to-many relation between hastag and tweet through hasHashtag
  @BelongsToMany(() => Tweet, () => HasHashtag, 'tweetId', 'hashtag')
  tweets?: Tweet[];
}