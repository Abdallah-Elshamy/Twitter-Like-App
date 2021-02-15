export interface UserLoggedIn {
    id : string ,
    name: String,
    email: String ,
    password: String,
    userName: String ,
    birthDate :String ,
    imageURL: String ,
    bio: String ,
    coverImageURL: String ,
    isFollowing: Boolean ,
    followingCount: Number,
    isFollower: Boolean,
    groups: [String],
    permissions: [String],
    createdAt: String,
    updatedAt: String,
    followersCount: Number ,
    followers?: any ,
    tweets?: any ,
    likes? :{
        totalNumberLkes : Number,
        tweets :any
    }
    following?: any
}

