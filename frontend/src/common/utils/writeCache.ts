import { Tweets } from "../queries/TweetQuery";
import { FeedTweets } from "../queries/Feedtweets";
import { LoggedUser } from "../queries/Userqery";
import { parseJwt } from "../decode";
import { apolloClient } from "../apolloClient";
import ReportedTweets from "../queries/reportedTweets";
import ReportedUsers from "../queries/reportedUsers";
import UnseenMessageCount from "../queries/unseenMessageCount"
import { CHAT_HISTORY } from "../queries/getChatHistory"
import {GET_CHAT_CONV} from "../queries/GET_CHAT_CONV"
import { gql } from "@apollo/client";
import { cache } from "../cache";
import ALL_SEEN from '../queries/ALL_SEEN';
import SetMessageSeen from "../queries/setMessageSeen"
import AllUnseenMessagesCount from "../queries/allUnseenMessagesCount"
import {NewTweetsCount} from "../cache"
import NewTweetsCountQuery from "../queries/newTweetsCount"


const incrementDecrementAllUnseenMessagesCount = (value: number) => {
    const messagesCountData:any = cache.readQuery({
        query: AllUnseenMessagesCount
    })
    cache.writeQuery({
        query: AllUnseenMessagesCount,
        data: {
            getUnseenMessages: {
                totalCount: messagesCountData?.getUnseenMessages?.totalCount + value,
                __typename: "PaginatedChatMessages"
            }
        }
    })
}
const createConvElement = async(chatMessage: any, isFrom: any) => {
    const convElement:any = {}
    const user = isFrom? chatMessage.from:chatMessage.to;
    convElement.with = user;
    const unseenMessages = await apolloClient.query({
        query: UnseenMessageCount,
        variables: {
            userId: user?.id,
        },
    });
    convElement.unseenMessageCount = unseenMessages?.data?.getUnseenMessagesCountFromUser;
    const time = isFrom?new Date(chatMessage?.createdAt).getTime():chatMessage?.createdAt
    convElement.lastMessage = {message: chatMessage?.message, createdAt: time}
    return convElement;
}

const sendReceiveMessage = async(chatMessage: any, isFrom: any) => {
    
    const user = isFrom? chatMessage.from:chatMessage.to;
    let conversation:any = {}
    let conversations: any = cache.readQuery({
        query: GET_CHAT_CONV
    });
    let decrementor = 0;
    if (!conversations) {
        conversations = await apolloClient.query({
            query: GET_CHAT_CONV,
        });
        conversations = conversations.data;
        decrementor = -1

    }
    console.log("conversations is ", conversations)
    let flage = 0;
    for (let conversation_data of conversations?.getConversationHistory?.conversations) {
        if(conversation_data?.with?.id === user?.id) {
            conversation.with = conversation_data?.with;
            conversation.unseenMessageCount = isFrom?(conversation_data?.unseenMessageCount || 0) + 1 + decrementor : (conversation_data?.unseenMessageCount || 0);
            const time = isFrom?new Date(chatMessage?.createdAt).getTime():chatMessage?.createdAt
            conversation.lastMessage = {message: chatMessage?.message, createdAt: time}
            flage = 1;
            break;
        }
    }
    if(!flage) {
        conversation = await createConvElement(chatMessage, isFrom);
    }
    const conversations_array:any = []
    conversations_array.push(conversation);
    flage = 0;
    for (let conversation_data of conversations?.getConversationHistory?.conversations) {
        if(conversation_data?.with?.id !== user?.id || flage) {
            if(conversation_data?.with?.id === user?.id) {
                conversations_array.push(conversation);
            } else {
                conversations_array.push(conversation_data);
            }
            
        }
        else {
            flage = 1;
        }
    }
    conversations &&
        cache.writeQuery({
            query: GET_CHAT_CONV,
            data: {
                getConversationHistory: {
                    __typename: "SendReceiveMessage",
                    conversations: [...conversations_array],
                    totalCount: conversations?.getConversationHistory?.totalCount,
                },
            },
        });

    let messages: any = cache.readQuery({
        query: CHAT_HISTORY,
        variables: {
            otherUserId: user?.id
        },
    });
    if (!messages) {
        return isFrom && incrementDecrementAllUnseenMessagesCount(1);
    }
    messages &&
        cache.writeQuery({
            query: CHAT_HISTORY,
            variables: {
                otherUserId: user?.id
            },
            data: {
                getChatHistory: {
                    messages: [chatMessage, ...(messages?.getChatHistory?.messages || [])],
                    totalCount: messages?.getChatHistory?.totalCount + 1 + decrementor,
                },
            },
        });
    isFrom && incrementDecrementAllUnseenMessagesCount(1);
}

const setUnseensToZero = (userId: any) => {
    let conversation:any = {}
    const conversations_array:any = []
    let conversations: any = cache.readQuery({
        query: GET_CHAT_CONV
    });
    let flage = 0;
    let callMutation = 0;
    for (let conversation_data of conversations?.getConversationHistory?.conversations) {
        if(conversation_data?.with?.id === userId) {
            conversation.with = conversation_data?.with;
            callMutation = conversation_data.unseenMessageCount>0?1:0;
            incrementDecrementAllUnseenMessagesCount(-1 * conversation_data.unseenMessageCount);
            conversation.unseenMessageCount = 0;
            conversation.lastMessage = conversation_data?.lastMessage;
            flage = 1;
            break;
        }
    }
    if(!flage) {
        return 0
    }
    for (let conversation_data of conversations?.getConversationHistory?.conversations) {
        if(conversation_data?.with?.id === userId) {
            conversations_array.push(conversation);
        } else {
            conversations_array.push(conversation_data);
        }
    }
    conversations &&
        cache.writeQuery({
            query: GET_CHAT_CONV,
            data: {
                getConversationHistory: {
                    __typename: "SendReceiveMessage",
                    conversations: [...conversations_array],
                    totalCount: conversations?.getConversationHistory?.totalCount,
                },
            },
        });
    return callMutation;
}

export const setUnseenConvToZero = (userId: any) => {
    if (setUnseensToZero(userId)){
        try {
            apolloClient.mutate({
                mutation: ALL_SEEN,
                variables:{
                    userId
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export const liveSetUnseenConvToZero = (chatMessage: any) => {
    if(!chatMessage) return;
    const profile = parseJwt(localStorage.getItem("token"));
    const from = chatMessage.from;
    console.log("profile id", profile.id)
    if(from.id === profile.id) return;
    if (setUnseensToZero(from.id)){
        try {
            apolloClient.mutate({
                mutation: SetMessageSeen,
                variables:{
                    messageId: chatMessage.id
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}

const writeTweetsFeedData = async (
    isSFW: boolean,
    cache: any,
    newTweet: any
) => {
    let overideFlag = 0;
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
        feedData = feedData?.data
        feedData = feedData?.data
        if(feedData?.getFeed?.tweets[0]?.id === newTweet?.id)
        {
            overideFlag = 1;
        }
    }
    feedData &&
        cache.writeQuery({
            query: FeedTweets,
            variables: {
                isSFW,
            },
            data: {
                getFeed: {
                    __typename: "NewTweets",
                    tweets: overideFlag?[...(feedData?.getFeed?.tweets || [])]: [newTweet, ...(feedData?.getFeed?.tweets)],
                    totalCount: overideFlag?feedData?.getFeed?.totalCount : feedData?.getFeed?.totalCount + 1,
                },
            },
        });
};
const writeTweetsFeedDataFromEnd = async (
    isSFW: boolean,
    cache: any,
    newTweet: any
) => {
    let overideFlag = 0;
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
        feedData = feedData?.data
        if(feedData?.getFeed?.tweets[0]?.id === newTweet?.id)
        {
            overideFlag = 1;
        }
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
                    tweets: overideFlag?[...(feedData?.getFeed?.tweets || [])]: [...(feedData?.getFeed?.tweets), newTweet],
                    totalCount: overideFlag?feedData?.getFeed?.totalCount : feedData?.getFeed?.totalCount + 1,
                },
            },
        });
};
const decrementTweetsFeedData = (isSFW: boolean, cache: any, decBy: number = 1) => {
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
                    __typename: "DeleteTweet",
                    tweets: [...(feedData.getFeed.tweets || [])],
                    totalCount: feedData.getFeed.totalCount - decBy,
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

const decrementTweetsCount = (cache: any, userId: number, decBy: number = 1) => {
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
                    newTweets.totalCount-=decBy;
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
    let overideFlag = 0;
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
        tweets = tweets?.data;
        if(tweets?.tweets?.tweets[0]?.id === newTweet?.id)
        {
            overideFlag = 1;
        }
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
                    __typename: "NewTweets",
                    tweets: overideFlag?[...(tweets?.tweets?.tweets || [])]:[newTweet, ...(tweets?.tweets?.tweets || [])],
                    totalCount: overideFlag?tweets?.tweets?.totalCount : tweets?.tweets?.totalCount + 1,
                },
            },
        });
};

const decrementTweetsProfileData = (
    isSFW: boolean,
    cache: any,
    userId: number,
    filter: string,
    decBy: number = 1
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
                    __typename: "DeleteTweet",
                    tweets: [...(tweets?.tweets?.tweets || [])],
                    totalCount: tweets.tweets.totalCount - decBy,
                },
            },
        });
};

export const updateChatMessagesForSendMessage = async(cache: any, {data}: any) => {
    const newMessage = data.sendMessage
    await sendReceiveMessage(newMessage, false);
}

export const updateChatMessagesForReceiveMessage = async(chatMessage: any) => {
    await sendReceiveMessage(chatMessage, true);
}
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
    let myRetweet = 0;
    if (tweet?.user?.id == profile?.id) {
        myRetweet = 1;
        decrementTweetsCount(cache, profile.id);
        decrementTweetsProfileData(true, cache, profile.id, "");
        decrementTweetsProfileData(false, cache, profile.id, "");
        decrementTweetsProfileData(true, cache, profile.id, "replies&tweets");
        decrementTweetsProfileData(false, cache, profile.id, "replies&tweets");
        if (tweet?.mediaURLs?.length > 0) {
            decrementTweetsProfileData(true, cache, profile.id, "media");
            decrementTweetsProfileData(false, cache, profile.id, "media");
        }
    }
    decrementTweetFromReportedTweets(cache);
    decrementTweetsFeedData(true, cache);
    decrementTweetsFeedData(false, cache);
    if (tweet?.isLiked) {
        decrementTweetsProfileData(true, cache, profile.id, "likes");
        decrementTweetsProfileData(false, cache, profile.id, "likes");
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
            decrementTweetsCount(cache, profile.id, 1 + myRetweet);
            decrementTweetsProfileData(true, cache, profile.id, "", 1 + myRetweet);
            decrementTweetsProfileData(false, cache, profile.id, "", 1 + myRetweet);
            decrementTweetsProfileData(true, cache, profile.id, "replies&tweets", 1 + myRetweet);
            decrementTweetsProfileData(false, cache, profile.id, "replies&tweets", 1 + myRetweet);

        }
        decrementTweetsFeedData(true, cache, 1 + retweetedTweets.length);
        decrementTweetsFeedData(false, cache, 1 + retweetedTweets.length);
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

const decrementTweetFromReportedTweets = (cache: any) => {
    let reportedTweets: any = cache.readQuery({
        query: ReportedTweets,
    });
    reportedTweets &&
        cache.writeQuery({
            query: ReportedTweets,
            data: {
                reportedTweets: {
                    __typename: "DeleteTweet",
                    tweets: [...(reportedTweets.reportedTweets.tweets || [])],
                    totalCount: reportedTweets.reportedTweets.totalCount - 1,
                },
            },
        });
}

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

export const updateLoggedUserQueryForFollow = (cache:any, user:any) => {
    const profile = parseJwt(localStorage.getItem("token"));
    let userData: any = cache.readQuery({
        query: LoggedUser,
        variables: {
            id: profile.id,
        },
    });
    userData && cache.modify({
        id: `User:${profile.id}`,
        fields: {
            followingCount(prevCount: any) {
                console.log("prev count", prevCount)
                return prevCount + 1;
            },
            following(prevFollowing: any) {
                if (prevFollowing.users.length <= 20 || parseInt(user.id) > (parseInt(prevFollowing.users[prevFollowing.users.length - 1]?.__ref?.split(":")[1]) || parseInt(prevFollowing.users[prevFollowing.users.length - 1]?.id) )) {
                    if(parseInt(user.id) > (parseInt(prevFollowing.users[prevFollowing.users.length - 1]?.__ref?.split(":")[1]) || parseInt(prevFollowing.users[prevFollowing.users.length - 1]?.id)))
                    {
                        return {
                            totalCount: prevFollowing.totalCount + 1,
                            users: [user, ...prevFollowing.users]
                        }
                    }
                    else if(prevFollowing.totalCount === prevFollowing.users.length){
                        return {
                            totalCount: prevFollowing.totalCount + 1,
                            users: [...prevFollowing.users, user]
                        }
                    }
                }
                else {
                    console.log("here in increment");
                    return {
                        
                        totalCount: prevFollowing.totalCount + 1,
                        users: [...prevFollowing.users]
                    }
                }
                
            }
        },
    })
}

export const updateLoggedUserQueryForUnFollow = (cache:any, user:any) => {
    const profile = parseJwt(localStorage.getItem("token"));
    let userData: any = cache.readQuery({
        query: LoggedUser,
        variables: {
            id: profile.id,
        },
    });
    console.log("user",  user)
    userData && cache.modify({
        id: `User:${profile.id}`,
        fields: {
            followingCount(prevCount: any) {
                console.log("prev count", prevCount)
                return prevCount - 1;
            },
            following(prevFollowing: any) {
                return {
                    totalCount: prevFollowing.totalCount - 1,
                    users: prevFollowing.users.filter((filteredUser:any) => {
                        console.log("filtered user", filteredUser)
                        console.log("the user", user)
                        return !(filteredUser.id == user.id || filteredUser.__ref == `User:${user.id}`)
                    })
                }
            }
        },
    })
}

export const updateLiveFeed = (tweet: any) => {
    const profile = parseJwt(localStorage.getItem("token"));
    if (tweet.user.id === "" + profile.id) return;
    if (tweet.state === "R") {
        cache.modify({
            id: `Tweet:${tweet.originalTweet.id}`,
            fields: {
                retweetsCount(prevValue: any) {
                    return prevValue + 1;
                }
            }
        })
    }
    if (tweet.state === "Q") {
        cache.modify({
            id: `Tweet:${tweet.originalTweet.id}`,
            fields: {
                quotedRetweetsCount(prevValue: any) {
                    return prevValue + 1;
                }
            }
        })
    }
    if (tweet.state === "C") {
        cache.modify({
            id: `Tweet:${tweet.repliedToTweet.id}`,
            fields: {
                repliesCount(prevCount: any) {
                    return prevCount + 1;
                },
                replies(prevReplies: any) {
                    let newReplies: any = [...prevReplies.tweets];
                    if (prevReplies.totalCount === prevReplies.tweets.length){
                        newReplies = [...prevReplies.tweets, tweet]
                    }
                    return {
                        tweets: newReplies,
                        totalCount: prevReplies.totalCount + 1
                    }
                }
            },
        });
    }
    const newTweetsCount: any = cache.readQuery({
        query: NewTweetsCountQuery
    })
    NewTweetsCount({ value: newTweetsCount.NewTweetsCount.value + 1});
    // writeTweetsFeedDataFromEnd(true, cache, tweet);
    writeTweetsFeedDataFromEnd(false, cache, tweet);
}