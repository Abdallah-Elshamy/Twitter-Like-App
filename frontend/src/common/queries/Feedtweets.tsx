import { gql } from "@apollo/client";

export const FeedTweets = gql`
    query feed_tweets($isSFW: Boolean, $page: Int) {
        getFeed(page: $page, isSFW: $isSFW) {
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
                            id
                            userName
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
                mediaURLs
                repliesCount
                state
                createdAt
                isLiked
                isRetweeted
            }
        }
    }
`;
