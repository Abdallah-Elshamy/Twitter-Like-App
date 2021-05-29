import React, { Fragment } from "react";
import { useQuery } from "@apollo/client";
import Tweet from "./Tweet";
import { TweetData } from "./TweetData_interface";
import { Get_SFW } from "../../common/queries/GET_SFW";
import Loading from "../../UI/Loading";
import './tweet.css';
import InfiniteScroll from "react-infinite-scroll-component";
import { parseJwt } from "../../common/decode";
import {GET_TWEET_REPLIES} from "../../common/queries/GET_TWEET_REPLIES"
import {updateTweetQuery, updateTweetsCacheForUnretweet} from "../../common/utils/writeCache"


export interface TweetFilter {
    page: number;
    setPage: any;
    id?: any;
    queryName?: string;
}

const TweetList: React.FC<TweetFilter> = (props) => {
    const queryName: any = {
        GET_TWEET_REPLIES
    }
    const {  page, setPage } = props;
    const sfw = useQuery(Get_SFW).data;
    const loggedUser = parseJwt(localStorage.getItem('token')!)
    let { loading, error, data, fetchMore } = useQuery<any>(queryName[props.queryName!], {
        variables: {
            isSFW: sfw.SFW.value,
            tweetId: props.id,
        },
    });
    if(data?.tweet?.replies) {
        data = {tweets: data.tweet.replies}
    }
    if (!loading && data && data?.tweets?.tweets?.length == 10 && data?.tweets?.totalCount > 10) {
        fetchMore({
            variables: {
                userId: props.id,
                isSFW: sfw.SFW.value,
                page: 2,
                tweetId: props.id
            },
            updateQuery: updateTweetQuery
        })
    }
    if (loading) return <Fragment><br /> <br /> <Loading size={30} /></Fragment>;
    if (error) return <p>`Error! ${error.message}`</p>;
    return (
        <InfiniteScroll
            dataLength={data?.tweets?.tweets?.length || 0}
            next={() => {
                setPage(Math.floor((data?.tweets?.tweets?.length || 10) / 10) + 1);
                fetchMore({
                    variables: {
                        userId: props.id,
                        isSFW: sfw.SFW.value,
                        page: Math.floor((data?.tweets?.tweets?.length || 10) / 10) + 1,
                        tweetId: props.id
                    },
                    updateQuery: updateTweetQuery
                })
            }}
            style={{
                overflow: "hidden"
            }}
            className="pb-20"
            hasMore={data?.tweets?.totalCount > data?.tweets?.tweets?.length || false}
            loader={<Loading />}
        >
            {data.tweets.tweets.map((tweet: TweetData) => {
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
