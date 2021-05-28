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
                incoming?.__typename == "QuoteRetweet")
        ) {
            return incoming;
        }
        const merged = existing
            ? { totalCount: existing.totalCount, tweets: [...existing.tweets] }
            : { totalCount: 0, tweets: [] };
        merged.totalCount = incoming.totalCount;
        console.log("incoming", incoming)
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

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                searchBarValue: {
                    read() {
                        return searchBarVar();
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
                users: createPaginationAndCombineUsersElements(["search"]),
                reportedTweets: createPaginationAndCombineTweetsElements([]),
                reportedUsers: createPaginationAndCombineUsersElements([]),
                NSFWTweets: createPaginationAndCombineTweetsElements([]),
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
    value: true,
});
