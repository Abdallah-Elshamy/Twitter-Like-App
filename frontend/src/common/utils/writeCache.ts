import { Tweets } from "../queries/TweetQuery";
import { FeedTweets } from "../queries/Feedtweets";
import { parseJwt } from "../decode";
import { apolloClient } from "../apolloClient";

const writeTweetsFeedData = async(isSFW: boolean, cache: any, newTweet: any) => {
    const feedData: any = cache.readQuery({
        query: FeedTweets,
        variables: {
            isSFW,
        },
    });
    if(!feedData) {
        await apolloClient.query({
            query: FeedTweets,
            variables: {
                isSFW
            }
        })
    }
    cache.writeQuery({
        query: FeedTweets,
        variables: {
            isSFW,
        },
        data: {
            getFeed: [newTweet, ...(feedData?.getFeed || [])],
        },
    });
};

const writeTweetsProfileData =  async(
    isSFW: boolean,
    cache: any,
    userId: number,
    filter: string,
    newTweet: any
) => {
    console.log(isSFW, cache, userId, filter, newTweet);
    const tweets: any = cache.readQuery({
        query: Tweets,
        variables: {
            userId,
            filter,
            isSFW,
        },
    });
    if (!tweets) {
        await apolloClient.query({
            query: Tweets,
            variables: {
                userId,
                filter,
                isSFW,
            },
        });
    }
    if (tweets) {
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
                    totalCount: tweets.tweets.totalCount + 1
                },
            },
        });
    }
    
};

export const updateTweetsCacheForCreateTweet = (cache: any, { data }: any) => {
    const profile = parseJwt(localStorage.getItem("token"));
    const newTweet = data.createTweet;
    writeTweetsFeedData(true, cache, newTweet);
    writeTweetsFeedData(false, cache, newTweet);
    writeTweetsProfileData(true, cache, profile.id, "", newTweet);
    writeTweetsProfileData(false, cache, profile.id, "", newTweet);
    writeTweetsProfileData(true, cache, profile.id, "replies&tweets", newTweet);
    writeTweetsProfileData(false, cache, profile.id, "replies&tweets", newTweet);
    if(newTweet.mediaURLs.length > 0) {
        writeTweetsProfileData(true, cache, profile.id, "media", newTweet);
        writeTweetsProfileData(false, cache, profile.id, "media", newTweet);
    }

};
