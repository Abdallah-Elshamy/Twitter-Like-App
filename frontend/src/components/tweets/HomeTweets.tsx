import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import Tweet from "./Tweet";
import { TweetData } from "./TweetData_interface";
import { FeedTweets } from "../../common/queries/Feedtweets";
import Loading from "../../UI/Loading";
import { Get_SFW } from "../../common/queries/GET_SFW";
import InfiniteScroll from "react-infinite-scroll-component";
import { parseJwt } from '../../common/utils/jwtDecoder'
import NewTweetsCount from "../../common/queries/newTweetsCount"

function HomeTweets() {
    const sfw = useQuery(Get_SFW).data;
    const loggedUser = parseJwt(localStorage.getItem('token')!)
    const {data: newTweetsCount} = useQuery(NewTweetsCount)
    const { loading, error, data, fetchMore } = useQuery(FeedTweets, {
        variables: {
            isSFW: sfw.SFW.value,
        },
    });
    const sfwValue = sfw.SFW.value;
    const newTweetsCountValue = newTweetsCount.NewTweetsCount.value
    const sfwPage = Math.floor((data?.getFeed?.tweets?.length + newTweetsCountValue || 10) / 10) ;
    const nsfwPage = Math.floor((data?.getFeed?.tweets?.length || 10) / 10);
    let [page, setPage] = useState(sfwValue?sfwPage:nsfwPage);

    console.log("new Tweets count", newTweetsCount.NewTweetsCount.value)
    console.log("new Tweets count", newTweetsCount.NewTweetsCount.value)

    if (!loading && data && data?.getFeed?.tweets?.length <= 10 && data?.getFeed?.totalCount > 10) {
        fetchMore({
            variables: {
                isSFW: sfw.SFW.value,
                page: sfwValue? sfwPage + 1 : nsfwPage + 1,
            },
        })
    }
    if (loading) return <Loading />;
    if (error) return <p>`Error! this is the one ${error.message}`</p>;

    return (
        <InfiniteScroll
            dataLength={data?.getFeed?.tweets?.length || 0}
            next={() => {
                setPage(sfwValue?sfwPage + 1: nsfwPage + 1);
                return fetchMore({
                    variables: {
                        isSFW: sfw.SFW.value,
                        page: sfwValue?sfwPage + 1: nsfwPage + 1,
                    },
                });
            }}
            hasMore={data?.getFeed?.totalCount > data?.getFeed?.tweets?.length +  newTweetsCountValue|| false}
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
