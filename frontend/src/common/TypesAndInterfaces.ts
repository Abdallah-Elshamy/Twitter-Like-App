export interface Trend {
  trendName: string,
  numOfTweets: Number,
}

export interface PersonEntity {
  name: string,
  username: string,
  followed: boolean,
  numberOfFollowers?: Number,
  imageURI?: string,
  bio?: string
}

export type searchBarValue = {
  value: string
}