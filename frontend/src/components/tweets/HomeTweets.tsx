import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import Tweet from "./Tweet";
import { TweetData } from "./TweetData_interface";
import { FeedTweets } from "../../common/queries/Feedtweets";
import Loading from "../../UI/Loading";
import { Get_SFW } from "../../common/queries/GET_SFW";
import InfiniteScroll from "react-infinite-scroll-component";
import { parseJwt } from '../../common/utils/jwtDecoder'

function HomeTweets() {
    const sfw = useQuery(Get_SFW).data;
    const loggedUser = parseJwt(localStorage.getItem('token')!)
    const { loading, error, data, fetchMore } = useQuery(FeedTweets, {
        variables: {
            isSFW: sfw.SFW.value,
        },
    });
    let [page, setPage] = useState(Math.floor((data?.getFeed?.tweets?.length || 10) / 10));

    
    if (!loading && data && data?.getFeed?.tweets?.length == 10 && data?.getFeed?.totalCount > 10 && page === 1) {
        setPage(page + 1)
        fetchMore({
            variables: {
                isSFW: sfw.SFW.value,
                page: 2,
            },
        })
    }
    if (loading) return <Loading />;
    if (error) return <p>`Error! this is the one ${error.message}`</p>;
<<<<<<< HEAD
    console.log("all tweets", data?.getFeed?.tweets)
    console.log("page is", page)
=======
>>>>>>> 578a584023afcd46a0bfd77f40d9c2586f9d31b4

    return (
        <InfiniteScroll
            dataLength={data?.getFeed?.tweets?.length || 0}
            next={() => {
                setPage(page + 1);
                return fetchMore({
                    variables: {
                        isSFW: sfw.SFW.value,
                        page: page + 1,
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
