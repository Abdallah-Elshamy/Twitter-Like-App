import React, { Fragment, useMemo, useRef } from "react";

import { useQuery } from "@apollo/client";
// import Tweet from '../Tweet';
import Tweet from "./Tweet";
import { Tweets } from "../../common/queries/TweetQuery";
import { TweetData } from "./TweetData_interface";
import { Get_SFW } from "../../common/queries/GET_SFW";
import Loading from "../../UI/Loading";
import './tweet.css';
import ReportedTweets from "../../common/queries/reportedTweets"
import NSFWTweets from "../../common/queries/NSFWTweets"
import InfiniteScroll from "react-infinite-scroll-component";
import { parseJwt } from "../../common/decode";
import { GET_TWEET_REPLIES } from "../../common/queries/GET_TWEET_REPLIES"
import { Hash_Tweets } from "../../common/queries/Hash_Tweets"

export interface TweetFilter {
    filter?: string;
    page: number;
    setPage: any;
    id?: any;
    queryName?: string;
    word?: string
}

const TweetList: React.FC<TweetFilter> = (props) => {
    TweetList.defaultProps = {
        queryName: "Tweets"
    }
    const queryName: any = {
        NSFWTweets,
        ReportedTweets,
        Tweets,
        GET_TWEET_REPLIES,
        Hash_Tweets
    }
    const { filter, page, setPage } = props;
    const sfw = useQuery(Get_SFW).data;
    const loggedUser = parseJwt(localStorage.getItem('token')!)
    let { loading, error, data, fetchMore } = useQuery<any>(queryName[props.queryName!] ? queryName[props.queryName!] : Tweets, {
        variables: {
            userId: props.id,
            filter: filter,
            isSFW: sfw.SFW.value,
            tweetId: props.id,
            word: props.word
        },
    });
    const oldData = useRef()
    console.log(props.word)
    if (data?.reportedTweets) {
        data = { tweets: data.reportedTweets }
    }
    if (data?.NSFWTweets) {
        data = { tweets: data.NSFWTweets }
    }
    if (data?.tweet?.replies) {
        data = { tweets: data.tweet.replies }
    }
    if (data?.hashtag?.tweets) {
        data = { tweets: data.hashtag.tweets }
    }
    if (!loading && data && data?.tweets?.tweets?.length == 10 && data?.tweets?.totalCount > 10) {
        fetchMore({
            variables: {
                userId: props.id,
                isSFW: sfw.SFW.value,
                page: 2,
                filter: filter,
                tweetId: props.id
            },
        })
    }
    if (loading) return <Fragment><br /> <br /> <Loading size={30} /></Fragment>;
    if (error) return <p>Something went wrong :(</p>;
    console.log("Tweets data", oldData)
    console.log("data is", data)
    return (
        <InfiniteScroll
            dataLength={data?.tweets?.tweets?.length || 0}
            next={() => {

                setPage(Math.floor((data?.tweets?.tweets?.length || 10) / 10) + 1);
                return fetchMore({
                    variables: {
                        userId: props.id,
                        isSFW: sfw.SFW.value,
                        page: Math.floor((data?.tweets?.tweets?.length || 10) / 10) + 1,
                        filter: filter,
                        tweetId: props.id
                    },
                });
            }}
            style={{
                overflow: "hidden"
            }}
            className="pb-24"
            hasMore={data?.tweets?.totalCount > data?.tweets?.tweets?.length || false}
            loader={<Loading />}
        >
            {data?.tweets?.tweets?.map((tweet: TweetData) => {
                return (
                    <Tweet
                        mediaURLs={tweet.mediaURLs}
                        id={tweet.id}
                        text={tweet.text}
                        repliesCount={tweet.repliesCount}
                        createdAt={tweet.createdAt}
                        isLiked={tweet.isLiked}
                        isRetweeted={tweet.isRetweeted}
                        user={tweet.user}
                        loggedUser={loggedUser}
                        tweet={tweet}
                        likesCount={tweet.likesCount}
                        key={tweet.id}
                        quotedRetweetsCount={tweet.quotedRetweetsCount}
                        retweetsCount={tweet.retweetsCount}
                        state={tweet.state}
                        originalTweet={tweet.originalTweet}
                        repliedToTweet={tweet.repliedToTweet}
                    />
                );
            })}
        </InfiniteScroll>
    );
};



export default TweetList;
