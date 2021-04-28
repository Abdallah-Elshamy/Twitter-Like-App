import React, { useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useQuery } from "@apollo/client";
import Tweet from "./Tweet";
import { TweetData } from "./Tweet";
import { FeedTweets } from "../../common/queries/Feedtweets";
import Loading from "../../UI/Loading";
import { Get_SFW } from "../../common/queries/GET_SFW";

function HomeTweets() {
  const [page, setPage] = useState(1)
    const sfw = useQuery(Get_SFW).data;
    const { loading, error, data, fetchMore } = useQuery(FeedTweets, {
        variables: {
            isSFW: sfw.SFW.value,
        },
    });
    if (loading) return <Loading />;
    if (error) return <p>`Error! this is the one ${error.message}`</p>;

    return (
        <InfiniteScroll
            dataLength={data.getFeed.length}
            next={() => {
                setPage(page + 1);
                return fetchMore({
                    variables: {
                        isSFW: sfw.SFW.value,
                        page: page + 1,
                    },
                });
            }}
            hasMore={data.getFeed.length >= page * 10}
            loader={<Loading />}
        >
            {data.getFeed.map((tweet: TweetData) => {
                console.log(`tweet is ${tweet}`);
                return (
                    <Tweet
                        text={tweet.text}
                        repliesCount={tweet.repliesCount}
                        createdAt={tweet.createdAt}
                        isLiked={tweet.isLiked}
                        user={tweet.user}
                        likesCount={tweet.likesCount}
                        key={tweet.id}
                    />
                );
            })}
        </InfiniteScroll>
    );
}

export default HomeTweets;
