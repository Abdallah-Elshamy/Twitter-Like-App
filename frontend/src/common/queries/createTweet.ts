import { gql } from "@apollo/client";

export const Post_Tweet = gql`
    mutation createTweet($tweetInput: TweetCreateInput!) {
        createTweet(tweet: $tweetInput) {
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
`;
export const Post_Reply = gql`
    mutation createReply($tweetInput: TweetCreateInput!, $repliedToTweet: ID!) {
        createReply(tweet: $tweetInput, repliedToTweet: $repliedToTweet) {
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
`;
export const Post_QRetweet = gql`
    mutation createQuotedRetweet(
        $tweetInput: TweetCreateInput!
        $originalTweetId: ID!
    ) {
        createQuotedRetweet(
            originalTweetId: $originalTweetId
            tweet: $tweetInput
        ) {
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
`;
