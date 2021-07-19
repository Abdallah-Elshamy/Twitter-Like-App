import { gql } from "@apollo/client";

export const Hash_Tweets = gql`
    query hashtag($word:String!) {
        hashtag(word:$word) {
    	  tweets{
            totalCount
            tweets {
                user {
                    id
                    imageURL
                    name
                    userName
                    isBanned
                }
                originalTweet {
                    id
                    text
                    likesCount
                    retweetsCount
                    repliesCount
                    state
                    createdAt
                    isLiked
                    mediaURLs
                    user {
                        id
                        userName
                        name
                        imageURL
                    }
                    originalTweet {
                        id
                    }
                    repliedToTweet {
                        id
                        user {
                            userName
                        }
                        mediaURLs
                        isSFW
                    }

                    repliedToTweet {
                        id
                        state
                        user {
                            id
                            userName
                            name
                            imageURL
                        }
                    }
                }

                repliedToTweet {
                    id
                    state
                    mode
                    mediaURLs
                    user {
                        id
                        userName
                        name
                        imageURL
                    }
                }
                id
                text
                likesCount
                retweetsCount
                quotedRetweetsCount
                repliesCount
                state
                createdAt
                mediaURLs
                isLiked
                isRetweeted
            }
        }
  }
}
`;
