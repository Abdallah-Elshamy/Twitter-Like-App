//used in trends
export interface Trend {
  trendName: string,
  numOfTweets: Number,
}

//used in search and suggestion list 
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
  id: string,
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

//used in search bar locally
export type searchBarValue = {
  value: string
}

// export interface logUser {
//   user?: User }

//used in protected routes locally
export type authinticatedValue = {
  value: boolean
}