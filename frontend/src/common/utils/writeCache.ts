import { Tweets } from "../queries/TweetQuery";
import { FeedTweets } from "../queries/Feedtweets";
import { LoggedUser } from "../queries/Userqery";
import { parseJwt } from "../decode";
import { apolloClient } from "../apolloClient";
import ReportedTweets from "../queries/reportedTweets"

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

export const updateTweetsCacheForDeleteTweet = (
    cache: any,
    tweet: any,
) => {
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
    }
    if (tweet?.isLiked) {
        decrementTweetsProfileData(true, cache, profile.id, "likes");
        decrementTweetsProfileData(false, cache, profile.id, "likes");
    }
};

export const updateTweetsCacheForIgnoreReportedTweet = (
    cache: any,
    tweet: any,
) => {
    let reportedTweets: any = cache.readQuery({
        query: ReportedTweets,
    });
    console.log("reported Tweets", reportedTweets)
    reportedTweets &&
        cache.writeQuery({
            query: ReportedTweets,
            data: {
                reportedTweets: {
                    __typename: "IgnoreReportedTweet",
                    tweets: reportedTweets?.reportedTweets?.tweets?.filter((existingTweet: any) => existingTweet?.id != tweet?.id),
                    totalCount: reportedTweets?.reportedTweets?.totalCount - 1,
                },
            },
        });
};
