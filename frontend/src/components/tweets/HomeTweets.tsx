import React, { useState } from "react";

import { useQuery, useSubscription } from "@apollo/client";
import Tweet from "./Tweet";
import { TweetData } from "./TweetData_interface";
import { FeedTweets } from "../../common/queries/Feedtweets";
import Loading from "../../UI/Loading";
import { Get_SFW } from "../../common/queries/GET_SFW";
import InfiniteScroll from "react-infinite-scroll-component";
import { parseJwt } from '../../common/utils/jwtDecoder'
import LiveFeed from "../../common/queries/liveFeed"

function HomeTweets() {
    let [page, setPage] = useState(1);
    const sfw = useQuery(Get_SFW).data;
    const loggedUser = parseJwt(localStorage.getItem('token')!)
    const { loading, error, data, fetchMore } = useQuery(FeedTweets, {
        variables: {
            isSFW: sfw.SFW.value,
        },
    });
    const {data: subFeedData} = useSubscription(LiveFeed, {
        onSubscriptionData() {
            console.log("new data arrived")
            console.log(subFeedData)
        }
    })
    subFeedData && console.log("sub data", subFeedData)
    if (!loading && data && data?.getFeed?.tweets?.length == 10 && data?.getFeed?.totalCount > 10) {
        fetchMore({
            variables: {
                isSFW: sfw.SFW.value,
                page: 2,
            },
        })
    }
    if (loading) return <Loading />;
    if (error) return <p>`Error! this is the one ${error.message}`</p>;
    console.log("all tweets", data?.getFeed?.tweets)

    return (
        <InfiniteScroll
            dataLength={data?.getFeed?.tweets?.length || 0}
            next={() => {
                setPage(Math.floor((data?.getFeed?.tweets?.length || 10) / 10) + 1);
                return fetchMore({
                    variables: {
                        isSFW: sfw.SFW.value,
                        page: Math.floor((data?.getFeed?.tweets?.length || 10) / 10) + 1,
                    },
                });
            }}
            hasMore={data?.getFeed?.totalCount > data?.getFeed?.tweets?.length || false}
            loader={<Loading />}
            style={{
                overflow: "hidden"
            }}
            className="pb-20"
        >
            {data?.getFeed?.tweets?.map((tweet: TweetData) => {
                return (
                    <Tweet
                        id={tweet.id}
                        text={tweet.text}
                        mediaURLs={tweet.mediaURLs}
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
}

export default HomeTweets;
