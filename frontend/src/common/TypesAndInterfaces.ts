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
  bio?: string,
  isFollowing?: Boolean
}
export interface User {
  // id: string, 
  userName: string,
  name: string,
  followed: boolean,
  numberOfFollowers?: Number,
  imageURL?: string,
  birthDate?: string,
  bio?: string,
  isFollowing?: Boolean
  coverImageURL?: string,
  createdAt?: string,
  followingCount?: Number,
  followersCount?: Number,
  tweets?: {
    totalCount?: Number
  }
}
export type searchBarValue = {
  value: string
}
export type authinticatedValue = {
  value: boolean
}