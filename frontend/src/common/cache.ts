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
        const merged = existing
            ? { totalCount: existing.totalCount, tweets: [...existing.tweets] }
            : { totalCount: 0, tweets: [] };
        merged.totalCount = incoming.totalCount;
        let i = 0;
        let j = 0;
        let k = 0;
        for (i = 0; i < merged.tweets.length; i++) {
            for (j = k; j < incoming.tweets.length; j++) {
                if (merged.tweets[i].__ref < incoming.tweets[j].__ref) {
                    merged.tweets.unshift(incoming.tweets[j])
                    k++;
                    break
                }
                if (merged.tweets[i].__ref == incoming.tweets[j].__ref) {
                    merged.tweets[i] = incoming.tweets[j];
                    k++;        
                    break;
                }
            }
        }  
        if (i == merged.tweets.length) i--;
        for (j=k; j < incoming.tweets.length; j++) {
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
        const merged = existing
            ? { totalCount: existing.totalCount, users: [...existing.users] }
            : { totalCount: 0, users: [] };
        merged.totalCount = incoming.totalCount;
        let i = 0;
        let j = 0;
        let k = 0;
        for (i = 0; i < merged.users.length; i++) {
            for (j = k; j < incoming.users.length; j++) {
                if (merged.users[i].__ref < incoming.users[j].__ref) {
                    merged.users.unshift(incoming.users[j])
                    k++;
                    break
                }
                if (merged.users[i].__ref == incoming.users[j].__ref) {
                    merged.users[i] = incoming.users[j]
                    k++
                    break;
                }
            }
        }
        if (i == merged.users.length) i--;
        for (j=k; j < incoming.users.length; j++) {
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
            },
        },
    },
});

export const searchBarVar: ReactiveVar<searchBarValue> = makeVar<searchBarValue>(
    { value: "" }
);

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
