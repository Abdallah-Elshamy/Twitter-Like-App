import { Tweets } from "../queries/TweetQuery";
import { FeedTweets } from "../queries/Feedtweets";
import { LoggedUser } from "../queries/Userqery";
import { parseJwt } from "../decode";
import { apolloClient } from "../apolloClient";
import ReportedTweets from "../queries/reportedTweets";
import ReportedUsers from "../queries/reportedUsers";
import { gql } from "@apollo/client";

const writeTweetsFeedData = async (
    isSFW: boolean,
    cache: any,
    newTweet: any
) => {
    let feedData: any = cache.readQuery({
        query: FeedTweets,
        variables: {
            isSFW,
        },
    });
    if (!feedData) {
        feedData = await apolloClient.query({
            query: FeedTweets,
            variables: {
                isSFW,
            },
        });
    }
    feedData &&
        cache.writeQuery({
            query: FeedTweets,
            variables: {
                isSFW,
            },
            data: {
                getFeed: {
                    tweets: [newTweet, ...(feedData?.getFeed?.tweets || [])],
                    totalCount: feedData?.getFeed?.totalCount + 1,
                },
            },
        });
};
const writeTweetsFeedDataFromEnd = async (
    isSFW: boolean,
    cache: any,
    newTweet: any
) => {
    let feedData: any = cache.readQuery({
        query: FeedTweets,
        variables: {
            isSFW,
        },
    });
    if (!feedData) {
        feedData = await apolloClient.query({
            query: FeedTweets,
            variables: {
                isSFW,
            },
        });
    }
    console.log("feed data is", feedData)
    // await Promise.all(feedData)
    feedData?.getFeed &&
        cache.writeQuery({
            query: FeedTweets,
            variables: {
                isSFW,
            },
            data: {
                getFeed: {
                    __typename: "QuoteRetweet",
                    tweets: [...(feedData?.getFeed?.tweets), newTweet],
                    totalCount: feedData?.getFeed?.totalCount + 1,
                },
            },
        });
};
const decrementTweetsFeedData = (isSFW: boolean, cache: any) => {
    const feedData: any = cache.readQuery({
        query: FeedTweets,
        variables: {
            isSFW,
        },
    });
    feedData &&
        cache.writeQuery({
            query: FeedTweets,
            variables: {
                isSFW,
            },
            data: {
                getFeed: {
                    tweets: [...(feedData.getFeed.tweets || [])],
                    totalCount: feedData.getFeed.totalCount - 1,
                },
            },
        });
};

const incrementTweetsCount = (cache: any, userId: number) => {
    const user = cache.readQuery({
        query: LoggedUser,
        variables: {
            id: userId,
        },
    });

    user &&
        cache.modify({
            id: cache.identify(user.user),
            fields: {
                tweets(prevTweets: any) {
                    const newTweets = { ...prevTweets };
                    newTweets.totalCount++;
                    return newTweets;
                },
            },
        });
};

const decrementTweetsCount = (cache: any, userId: number) => {
    const user = cache.readQuery({
        query: LoggedUser,
        variables: {
            id: userId,
        },
    });

    user &&
        cache.modify({
            id: cache.identify(user.user),
            fields: {
                tweets(prevTweets: any) {
                    const newTweets = { ...prevTweets };
                    newTweets.totalCount--;
                    return newTweets;
                },
            },
        });
};

const writeTweetsProfileData = async (
    isSFW: boolean,
    cache: any,
    userId: number,
    filter: string,
    newTweet: any
) => {
    let tweets: any = cache.readQuery({
        query: Tweets,
        variables: {
            userId,
            filter,
            isSFW,
        },
    });
    if (!tweets) {
        tweets = await apolloClient.query({
            query: Tweets,
            variables: {
                userId,
                filter,
                isSFW,
            },
        });
    }
    tweets &&
        cache.writeQuery({
            query: Tweets,
            variables: {
                userId,
                filter,
                isSFW,
            },
            data: {
                tweets: {
                    tweets: [newTweet, ...(tweets?.tweets?.tweets || [])],
                    totalCount: tweets?.tweets?.totalCount + 1,
                },
            },
        });
};

const decrementTweetsProfileData = (
    isSFW: boolean,
    cache: any,
    userId: number,
    filter: string
) => {
    const tweets: any = cache.readQuery({
        query: Tweets,
        variables: {
            userId,
            filter,
            isSFW,
        },
    });
    tweets &&
        cache.writeQuery({
            query: Tweets,
            variables: {
                userId,
                filter,
                isSFW,
            },
            data: {
                tweets: {
                    tweets: [...(tweets?.tweets?.tweets || [])],
                    totalCount: tweets.tweets.totalCount - 1,
                },
            },
        });
};

export const updateTweetsCacheForCreateTweet = async (
    cache: any,
    { data }: any
) => {
    const profile = parseJwt(localStorage.getItem("token"));
    const newTweet = data.createTweet;
    writeTweetsFeedData(true, cache, newTweet);
    writeTweetsFeedData(false, cache, newTweet);
    writeTweetsProfileData(true, cache, profile.id, "", newTweet);
    writeTweetsProfileData(false, cache, profile.id, "", newTweet);
    writeTweetsProfileData(true, cache, profile.id, "replies&tweets", newTweet);
    writeTweetsProfileData(
        false,
        cache,
        profile.id,
        "replies&tweets",
        newTweet
    );
    if (newTweet.mediaURLs.length > 0) {
        writeTweetsProfileData(true, cache, profile.id, "media", newTweet);
        writeTweetsProfileData(false, cache, profile.id, "media", newTweet);
    }
    incrementTweetsCount(cache, profile.id);
};

export const updateTweetsCacheForCreateQuotedRetweet = async (
    cache: any,
    { data }: any
) => {
    const profile = parseJwt(localStorage.getItem("token"));
    const newTweet = data.createQuotedRetweet;
    console.log("original", newTweet.originalTweet);
    cache.modify({
        id: `Tweet:${newTweet.originalTweet.id}`,
        fields: {
            quotedRetweetsCount(prevCount: any) {
                return prevCount + 1;
            },
        },
    });
    writeTweetsFeedDataFromEnd(true, cache, newTweet);
    writeTweetsFeedDataFromEnd(false, cache, newTweet);
    writeTweetsProfileData(true, cache, profile.id, "", newTweet);
    writeTweetsProfileData(false, cache, profile.id, "", newTweet);
    writeTweetsProfileData(true, cache, profile.id, "replies&tweets", newTweet);
    writeTweetsProfileData(
        false,
        cache,
        profile.id,
        "replies&tweets",
        newTweet
    );
    if (newTweet.mediaURLs.length > 0) {
        writeTweetsProfileData(true, cache, profile.id, "media", newTweet);
        writeTweetsProfileData(false, cache, profile.id, "media", newTweet);
    }
    incrementTweetsCount(cache, profile.id);
};

export const updateTweetsCacheForRetweet = async (
    cache: any,
    { data }: any
) => {
    const profile = parseJwt(localStorage.getItem("token"));
    const newTweet = data.createRetweet;
    writeTweetsFeedDataFromEnd(true, cache, newTweet);
    writeTweetsFeedDataFromEnd(false, cache, newTweet);
    writeTweetsProfileData(true, cache, profile.id, "", newTweet);
    writeTweetsProfileData(false, cache, profile.id, "", newTweet);
    writeTweetsProfileData(true, cache, profile.id, "replies&tweets", newTweet);
    writeTweetsProfileData(
        false,
        cache,
        profile.id,
        "replies&tweets",
        newTweet
    );
    incrementTweetsCount(cache, profile.id);
};

export const updateTweetsCacheForCreateReply = async (
    cache: any,
    { data }: any
) => {
    const profile = parseJwt(localStorage.getItem("token"));
    const newTweet = data.createReply;
    cache.modify({
        id: `Tweet:${newTweet.repliedToTweet.id}`,
        fields: {
            repliesCount(prevCount: any) {
                return prevCount + 1;
            },
            replies(prevReplies: any) {
                let newReplies: any = [...prevReplies.tweets];
                if (prevReplies.totalCount === prevReplies.tweets.length){
                    newReplies = [...prevReplies.tweets, newTweet]
                }
                return {
                    tweets: newReplies,
                    totalCount: prevReplies.totalCount + 1
                }
            }
        },
    });
    writeTweetsFeedDataFromEnd(true, cache, newTweet);
    writeTweetsFeedDataFromEnd(false, cache, newTweet);
    writeTweetsProfileData(true, cache, profile.id, "replies&tweets", newTweet);
    writeTweetsProfileData(
        false,
        cache,
        profile.id,
        "replies&tweets",
        newTweet
    );
    if (newTweet.mediaURLs.length > 0) {
        writeTweetsProfileData(true, cache, profile.id, "media", newTweet);
        writeTweetsProfileData(false, cache, profile.id, "media", newTweet);
    }
    incrementTweetsCount(cache, profile.id);
};

export const updateTweetsCacheForDeleteTweet = (cache: any, tweet: any) => {
    const profile = parseJwt(localStorage.getItem("token"));
    if (tweet?.user?.id == profile?.id) {
        decrementTweetsCount(cache, profile.id);
        decrementTweetsFeedData(true, cache);
        decrementTweetsFeedData(false, cache);
        decrementTweetsProfileData(true, cache, profile.id, "");
        decrementTweetsProfileData(false, cache, profile.id, "");
        decrementTweetsProfileData(true, cache, profile.id, "replies&tweets");
        decrementTweetsProfileData(false, cache, profile.id, "replies&tweets");
        if (tweet?.mediaURLs?.length > 0) {
            decrementTweetsProfileData(true, cache, profile.id, "media");
            decrementTweetsProfileData(false, cache, profile.id, "media");
        }
        const serializedState = cache.extract()
        const allTweetsInCache = Object.values(serializedState).filter((item:any) => item.__typename === 'Tweet')
        const retweetedTweets: any = allTweetsInCache.filter((tweetf: any) => {
        return tweetf?.originalTweet?.__ref === `Tweet:${tweet?.id}` && tweetf?.state === "R"
        })
        for (let retweetedTweet of retweetedTweets) {
            const normalizedId = cache.identify({
                id: retweetedTweet.id,
                __typename: "Tweet",
            });
            if (normalizedId) {
                cache.evict({ id: normalizedId });
            }
            if (retweetedTweet?.user?.__ref.split(":")[1] === profile?.id?.toString()) {
                decrementTweetsCount(cache, profile.id);
                decrementTweetsProfileData(true, cache, profile.id, "");
                decrementTweetsProfileData(false, cache, profile.id, "");
                decrementTweetsProfileData(true, cache, profile.id, "replies&tweets");
                decrementTweetsProfileData(false, cache, profile.id, "replies&tweets");

            }
            decrementTweetsFeedData(true, cache);
            decrementTweetsFeedData(false, cache);
        }
        if (tweet.state === "C") {
            console.log("retweet is ", tweet)
            cache.modify({
                id: `Tweet:${tweet?.repliedToTweet?.id}`,
                fields: {
                    repliesCount(prevCount: any) {
                        return prevCount - 1;
                    },
                    replies(prevReplies: any) {
                        let newReplies: any = [...prevReplies.tweets];
                        return {
                            tweets: newReplies,
                            totalCount: prevReplies.totalCount - 1
                        }
                    }
                }
            })
        }
        if (tweet.state === "Q") {
            cache.modify({
                id: `Tweet:${tweet?.originalTweet?.id}`,
                fields: {
                    quotedRetweetsCount(prevCount: any) {
                        return prevCount - 1;
                    },
                }
            })
        }
    }
    if (tweet?.isLiked) {
        decrementTweetsProfileData(true, cache, profile.id, "likes");
        decrementTweetsProfileData(false, cache, profile.id, "likes");
    }
};

export const updateTweetsCacheForUnretweet = (cache: any) => {
    const profile = parseJwt(localStorage.getItem("token"));
    decrementTweetsCount(cache, profile.id);
    decrementTweetsFeedData(true, cache);
    decrementTweetsFeedData(false, cache);
    decrementTweetsProfileData(true, cache, profile.id, "");
    decrementTweetsProfileData(false, cache, profile.id, "");
    decrementTweetsProfileData(true, cache, profile.id, "replies&tweets");
    decrementTweetsProfileData(false, cache, profile.id, "replies&tweets");
};

export const updateTweetsCacheForIgnoreReportedTweet = (
    cache: any,
    tweet: any
) => {
    let reportedTweets: any = cache.readQuery({
        query: ReportedTweets,
    });
    reportedTweets &&
        cache.writeQuery({
            query: ReportedTweets,
            data: {
                reportedTweets: {
                    __typename: "IgnoreReportedTweet",
                    tweets: reportedTweets?.reportedTweets?.tweets?.filter(
                        (existingTweet: any) => existingTweet?.id != tweet?.id
                    ),
                    totalCount: reportedTweets?.reportedTweets?.totalCount - 1,
                },
            },
        });
};

const removeUserFromReportedUsers = (cache: any, user: any) => {
    let reportedUsers: any = cache.readQuery({
        query: ReportedUsers,
    });
    reportedUsers &&
        cache.writeQuery({
            query: ReportedUsers,
            data: {
                reportedUsers: {
                    __typename: "BanOrIgnoreUser",
                    users: reportedUsers?.reportedUsers?.users?.filter(
                        (existingUser: any) => existingUser?.id != user?.id
                    ),
                    totalCount: reportedUsers?.reportedUsers?.totalCount - 1,
                },
            },
        });

    return reportedUsers;
};

export const updateUsersCacheForIgnoreReportedUser = (
    cache: any,
    user: any
) => {
    removeUserFromReportedUsers(cache, user);
};

export const updateUsersCacheForReportUser = (cache: any, user: any) => {
    let reportedUsers: any = cache.readQuery({
        query: ReportedUsers,
    });
    reportedUsers &&
        cache.writeQuery({
            query: ReportedUsers,
            data: {
                reportedUsers: {
                    __typename: "ReportUser",
                    users: [user, ...reportedUsers?.reportedUsers?.users],
                    totalCount: reportedUsers?.reportedUsers?.totalCount + 1,
                },
            },
        });
};

export const updateTweetsCacheForReportTweet = (cache: any, tweet: any) => {
    let reportedTweets: any = cache.readQuery({
        query: ReportedTweets,
    });
    reportedTweets &&
        cache.writeQuery({
            query: ReportedTweets,
            data: {
                reportedTweets: {
                    __typename: "ReportTweet",
                    tweets: [tweet, ...reportedTweets?.reportedTweets?.tweets],
                    totalCount: reportedTweets?.reportedTweets?.totalCount + 1,
                },
            },
        });
};

export const updateTweetsCacheForLikeTweet = (
    cache: any,
    tweetId: any,
    userId: any,
    isSFW: any
) => {
    let likedTweets: any = cache.readQuery({
        query: Tweets,
        variables: {
            filter: "likes",
            userId,
            isSFW,
        },
    });
    const tweet = cache.readFragment({
        id: `Tweet:${tweetId}`,
        fragment: gql`
            fragment myTweet on Tweet {
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
        `,
    });
    likedTweets &&
        cache.writeQuery({
            query: Tweets,
            variables: {
                filter: "likes",
                userId,
                isSFW,
            },
            data: {
                tweets: {
                    __typename: "LikeTweet",
                    tweets: [tweet, ...likedTweets?.tweets?.tweets],
                    totalCount: likedTweets?.tweets?.totalCount + 1,
                },
            },
        });
};

export const updateTweetsCacheForUnlikeTweet = (
    cache: any,
    tweetId: any,
    userId: any,
    isSFW: any
) => {
    let likedTweets: any = cache.readQuery({
        query: Tweets,
        variables: {
            filter: "likes",
            userId,
            isSFW,
        },
    });
    const tweet = cache.readFragment({
        id: `Tweet:${tweetId}`,
        fragment: gql`
            fragment myTweet on Tweet {
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
        `,
    });
    likedTweets &&
        cache.writeQuery({
            query: Tweets,
            variables: {
                filter: "likes",
                userId,
                isSFW,
            },
            data: {
                tweets: {
                    __typename: "UnlikeTweet",
                    tweets: likedTweets?.tweets?.tweets?.filter(
                        (existingTweet: any) => existingTweet?.id != tweet?.id
                    ),
                    totalCount: likedTweets?.tweets?.totalCount - 1,
                },
            },
        });
};

export const updateUsersCacheForBanUser = (cache: any, user: any) => {
    cache.modify({
        id: `User:${user.id}`,
        fields: {
            isBanned(prevTweets: any) {
                return true;
            },
        },
    }) && removeUserFromReportedUsers(cache, user);
};

export const updateUsersCacheForUnBanUser = (cache: any, user: any) => {
    cache.modify({
        id: `User:${user.id}`,
        fields: {
            isBanned(prevTweets: any) {
                return false;
            },
        },
    });
};

export const updateTweetQuery  = (prevResult: any, {fetchMoreResult: newTweet}: any) => {
    let newResult = {...newTweet}
    newResult.tweet = {...newTweet.tweet}
    newResult.tweet.replies = {...newTweet.tweet.replies}
    newResult.tweet.replies.tweets = [...prevResult.tweet.replies.tweets]
    let i = 0;
    let j = 0;
    let k = 0;
    for( i = 0 ; i< newResult.tweet.replies.tweets.length; i++){
        for(j = 0; j< newTweet.tweet.replies.tweets.length; j++){
            if(newResult.tweet.replies.tweets[i].id === newTweet.tweet.replies.tweets[j].id) {
                newResult.tweet.replies.tweets[i] = newTweet.tweet.replies.tweets[j]
                k++;
                break;
            }
        }
    }
    if (i == newResult.tweet.replies.tweets.length) i--;
    for (j = k; j < newTweet.tweet.replies.tweets.length; j++) {
        newResult.tweet.replies.tweets[++i] = newTweet.tweet.replies.tweets[j]
    }
    newResult.tweet.replies.tweets.slice(0, i + 1);

    return newResult;

}

export const updateUserQuery = (prevResult: any, {fetchMoreResult: newUser}: any) => {
    console.log("prev result", prevResult)
    console.log("new result", newUser)
    let newResult = {...newUser}
    newResult.user = {...newUser.user}
    newResult.user.following = {...newUser.user.following}
    newResult.user.followers = {...newUser.user.followers}
    newResult.user.following.users = [...prevResult.user.following.users]
    newResult.user.followers.users = [...prevResult.user.followers.users]
    let i = 0;
    let j = 0;
    let k = 0;
    for( i = 0 ; i< newResult.user.following.users.length; i++){
        for(j = 0; j< newUser.user.following.users.length; j++){
            if(newResult.user.following.users[i].id === newUser.user.following.users[j].id) {
                newResult.user.following.users[i] = newUser.user.following.users[j]
                k++;
                break;
            }
        }
    }
    if (i == newResult.user.following.users.length) i--;
    for (j = k; j < newUser.user.following.users.length; j++) {
        newResult.user.following.users[++i] = newUser.user.following.users[j]
    }
    newResult.user.following.users.slice(0, i + 1);

    i = 0;
    j = 0;
    k = 0;
    for( i = 0 ; i< newResult.user.followers.users.length; i++){
        for(j = 0; j< newUser.user.followers.users.length; j++){
            if(newResult.user.followers.users[i].id === newUser.user.followers.users[j].id) {
                newResult.user.followers.users[i] = newUser.user.followers.users[j]
                k++;
                break;
            }
        }
    }
    if (i == newResult.user.followers.users.length) i--;
    for (j = k; j < newUser.user.followers.users.length; j++) {
        newResult.user.followers.users[++i] = newUser.user.followers.users[j]
    }
    newResult.user.followers.users.slice(0, i + 1);

    return newResult;
}