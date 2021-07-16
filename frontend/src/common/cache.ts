import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { searchBarValue } from "./TypesAndInterfaces";

const createPaginationAndCombine = (keyArgs: any[]) => ({
    merge(existing: any, incoming: any) {
        const merged = existing ? existing.slice(0) : [];

        let breakFlag = 0;
        let i = 0;
        let j = 0;
        for (i = 0; i < merged.length; i++) {
            if (breakFlag) break;
            for (j = 0; j < incoming.length; j++) {
                if (merged[i].__ref == incoming[j].__ref) {
                    breakFlag = 1;
                    i -= 2;
                    break;
                }
            }
            j = 0;
        }
        if (i == merged.length) i--;
        for (; j < incoming.length; j++) {
            merged[++i] = incoming[j];
        }
        return merged.slice(0, i + 1);
    },
    read(existing: any) {
        return existing;
    },
    keyArgs,
});
const createPaginationAndCombineTweetsElements = (keyArgs: any[]) => ({
    merge(existing: any, incoming: any) {
        if (
            incoming?.__typename &&
            (incoming?.__typename == "IgnoreReportedTweet" ||
                incoming?.__typename == "ReportTweet" ||
                incoming?.__typename == "LikeTweet" ||
                incoming?.__typename == "UnlikeTweet" ||
                incoming?.__typename == "QuoteRetweet" ||
                incoming?.__typename == "DeleteTweet")
        ) {
            return incoming;
        }
        console.log("existing is", existing)
        console.log("incoming is", incoming)
        const merged = existing
            ? { totalCount: existing.totalCount, tweets: [...existing.tweets] }
            : { totalCount: 0, tweets: [] };
        merged.totalCount = incoming.totalCount;
        let i = 0;
        let j = 0;
        let k = 0;
        for (i = 0; i < merged.tweets.length; i++) {
            for (j = k; j < incoming.tweets.length; j++) {
                if (
                    parseInt(merged.tweets[i].__ref.split(":")[1]) <
                    parseInt(incoming.tweets[j].__ref.split(":")[1])
                ) {
                    merged.tweets.unshift(incoming.tweets[j]);
                    k++;
                    break;
                }
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
        console.log("merged is", merged)

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
        console.log("merged is", merged)

        return merged;
    },
    read(existing: any) {
        return existing;
    },
    keyArgs,
});
const createPaginationAndCombineTweetElements = (keyArgs: any[]) => ({
    merge(existing: any, incoming: any) {
        // const merged = existing ? existing:incoming
        // ? { totalCount: existing.totalCount, tweets: [...existing.tweets] }
        // : { totalCount: 0, tweets: [] };
        if (incoming.id) {
            console.log("incoming is", incoming.replies)
            const merged = { ...incoming, replies: { totalCount: incoming.replies.totalCount, tweets: [...incoming.replies.tweets] } }
            console.log("merged is", merged)
            if (merged) merged.replies.tweets = [...existing.replies.tweets, incoming.replies.tweets]
            return merged;
        }
        // return incoming
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
        console.log("incoming is", incoming)
        console.log("exisitng is", existing)
        if (
            incoming?.__typename &&
            incoming?.__typename === "SendReceiveMessage"
        ) {
            console.log("should return")
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

export const chatUserVar: ReactiveVar<any> = makeVar<any>({
    id: undefined,
    name: undefined,
    username: undefined,
    imgURL: undefined
});

