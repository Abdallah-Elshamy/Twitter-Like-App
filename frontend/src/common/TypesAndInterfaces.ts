export interface Trend {
  trendName: string,
  numOfTweets: Number,
}

export interface PersonEntity {
  id: string
  name: string,
  username: string,
  followed: boolean,
  numberOfFollowers?: Number,
  imageURI?: string,
  bio?: string
  isFollowing?: Boolean
}

export type searchBarValue = {
  value: string
}