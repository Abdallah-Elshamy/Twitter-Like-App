export interface TweetData {
  user?: {
    imageURL?: string
    name?: string
    userName?: string
  }
  id?: string
  text: string
  likesCount?: number
  repliesCount?: number
  retweetsCount?: number
  quotedRetweetsCount?: number
  createdAt?: number
  isLiked?: boolean
  isRetweeted: boolean
  state?: string
  originalTweet?: {
    user?:
    {
      imageURL?: string
      name?: string
      userName?: string
    }
  }

  repliedToTweet: {
    user?: string
    id?: string
    state?: string
  }
}

