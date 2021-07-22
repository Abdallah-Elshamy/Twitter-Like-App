import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { searchBarValue } from "./TypesAndInterfaces";

const createPaginationAndCombineTweetsElements = (keyArgs: any[]) => ({
    merge(existing: any, incoming: any) {
        if (
            incoming?.__typename &&
            (incoming?.__typename == "IgnoreReportedTweet" ||
                incoming?.__typename == "ReportTweet" ||
                incoming?.__typename == "LikeTweet" ||
                incoming?.__typename == "UnlikeTweet" ||
                incoming?.__typename == "QuoteRetweet" ||
                incoming?.__typename == "DeleteTweet" ||
                incoming?.__typename == "NewTweets")
        ) {
            return incoming;
        }
        const merged = existing
            ? { totalCount: existing.totalCount, tweets: [...existing.tweets] }
            : { totalCount: 0, tweets: [] };
        merged.totalCount = incoming.totalCount;
        let i = 0;
        let j = 0;
        let k = 0;
        for (i = 0; i < merged.tweets.length; i++) {
            for (j = 0; j < incoming.tweets.length; j++) {
                if (merged.tweets[i].__ref == incoming.tweets[j].__ref) {
                    merged.tweets[i] = incoming.tweets[j];
                    k++;
                    break;
                }
            }
        }
        if (i == merged.tweets.length) i--;
        for (j = k; j < incoming.tweets.length; j++) {
            merged.tweets[++i] = incoming.tweets[j];
        }
        merged.tweets.slice(0, i + 1);

        return merged;
    },
    read(existing: any) {
        return existing;
    },
    keyArgs,
});
const createPaginationAndCombineChatsElements = (keyArgs: any[]) => ({
    merge(existing: any, incoming: any) {
        const merged = existing
            ? { totalCount: existing.totalCount, messages: [...existing.messages] }
            : { totalCount: 0, messages: [] };
        merged.totalCount = incoming.totalCount;
        let i = 0;
        let j = 0;
        let k = 0;
        for (i = 0; i < merged.messages.length; i++) {
            for (j = k; j < incoming.messages.length; j++) {
                if (
                    parseInt(merged.messages[i].__ref.split(":")[1]) <
                    parseInt(incoming.messages[j].__ref.split(":")[1])
                ) {
                    merged.messages.unshift(incoming.messages[j]);
                    k++;
                    break;
                }
                if (merged.messages[i].__ref == incoming.messages[j].__ref) {
                    merged.messages[i] = incoming.messages[j];
                    k++;
                    break;
                }
            }
        }
        if (i == merged.messages.length) i--;
        for (j = k; j < incoming.messages.length; j++) {
            merged.messages[++i] = incoming.messages[j];
        }
        merged.messages.slice(0, i + 1);

        return merged;
    },
    read(existing: any) {
        return existing;
    },
    keyArgs,
});

const createPaginationAndCombineUsersElements = (keyArgs: any[]) => ({
    merge(existing: any, incoming: any) {
        if (
            incoming?.__typename &&
            (incoming?.__typename == "BanOrIgnoreUser" ||
                incoming?.__typename == "ReportUser")
        ) {
            return incoming;
        }
        const merged = existing
            ? { totalCount: existing.totalCount, users: [...existing.users] }
            : { totalCount: 0, users: [] };
        merged.totalCount = incoming.totalCount;
        let i = 0;
        let j = 0;
        let k = 0;
        for (i = 0; i < merged.users.length; i++) {
            for (j = k; j < incoming.users.length; j++) {
                if (merged.users[i].__ref == incoming.users[j].__ref) {
                    merged.users[i] = incoming.users[j];
                    k++;
                    break;
                }
            }
        }
        if (i == merged.users.length) i--;
        for (j = k; j < incoming.users.length; j++) {
            merged.users[++i] = incoming.users[j];
        }
        merged.users.slice(0, i + 1);
        return merged;
    },
    read(existing: any) {
        return existing;
    },
    keyArgs,
});

const createPaginationAndCombineConvElements = (keyArgs: any[]) => ({
    merge(existing: any, incoming: any) {
        if (
            incoming?.__typename &&
            incoming?.__typename === "SendReceiveMessage"
        ) {
            return incoming;
        }
        const merged = existing
            ? { totalCount: existing.totalCount, conversations: [...existing.conversations] }
            : { totalCount: 0, conversations: [] };
        merged.totalCount = incoming.totalCount;
        merged.conversations = [...merged.conversations, ...incoming.conversations]
        return merged;
    },
    read(existing: any) {
        return existing;
    },
    keyArgs,
});

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                searchBarValue: {
                    read() {
                        return searchBarVar();
                    },
                },
                chatUser: {
                    read() {
                        return chatUserVar();
                    },
                },
                EditProfileImage: {
                    read() {
                        return EditProfileImageVal();
                    },
                },
                EditProfileBg: {
                    read() {
                        return EditProfileBgVal();
                    },
                },

                SFW: {
                    read() {
                        return SFW();
                    },
                },
                NewTweetsCount: {
                    read() {
                        return NewTweetsCount();
                    },
                },

                getFeed: createPaginationAndCombineTweetsElements(["isSFW"]),
                tweets: createPaginationAndCombineTweetsElements([
                    "userId",
                    "filter",
                    "isSFW",
                ]),
                // replies:createPaginationAndCombineTweetsElements(["id", "isSFW"]),
                users: createPaginationAndCombineUsersElements(["search"]),
                reportedTweets: createPaginationAndCombineTweetsElements([]),
                reportedUsers: createPaginationAndCombineUsersElements([]),
                NSFWTweets: createPaginationAndCombineTweetsElements([]),
                getChatHistory: createPaginationAndCombineChatsElements(["otherUserId"]),
                getConversationHistory: createPaginationAndCombineConvElements([]),
                // tweet: createPaginationAndCombineTweetElements(["id", "isSFW"])
            },
        },
    },
});

export const searchBarVar: ReactiveVar<searchBarValue> =
    makeVar<searchBarValue>({ value: "" });

export const EditProfileImageVal: ReactiveVar<{
    Image: object | false;
    ImageURL: string | false;
}> = makeVar<any>({
    Image: false,
    ImageURL: false,
});
export const EditProfileBgVal: ReactiveVar<{
    BgImage: object | false;
    BgImageURL: string | false;
}> = makeVar<any>({
    BgImage: false,
    BgImageURL: false,
});

export const SFW: ReactiveVar<{ value: boolean }> = makeVar<any>({
    value: localStorage.getItem("SFW") ? JSON.parse(localStorage.getItem("SFW")!) : true
});

export const NewTweetsCount: ReactiveVar<{ value: number }> = makeVar<any>({
    value: 0
});

export const chatUserVar: ReactiveVar<any> = makeVar<any>({
    id: undefined,
    name: undefined,
    username: undefined,
    imgURL: undefined
});

