import React, { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@apollo/client";
// import Tweet from '../Tweet';
import Tweet from "./Tweet";
import { Tweets } from "../../common/queries/TweetQuery";
import { TweetData } from "./Tweet";
import { parseJwt } from "../../common/decode";
import { Get_SFW } from "../../common/queries/GET_SFW";
import Loading from "../../UI/Loading";

export interface TweetFilter {
    filter: string;
    page: number;
    setPage: any;
    id: string;
}

const TweetList: React.FC<TweetFilter> = (props) => {

    const { filter, page, setPage } = props;
    const sfw = useQuery(Get_SFW).data;
    const { loading, error, data, fetchMore } = useQuery(Tweets, {
        variables: {
            userId: props.id,
            filter: filter,
            isSFW: sfw.SFW.value,
        },
    });
    // data?.tweets?.totalCount
    // data?.tweets?.tweets?.length
    // console.log("totalCount", data?.tweets?.totalCount)
    if (!loading && data && data?.tweets?.totalCount > 10 && page === 1) {
        setPage(page + 1);
        fetchMore({
            variables: {
                userId: props.id,
                isSFW: sfw.SFW.value,
                page: page + 1,
                filter: filter
            },
        })
    }
    if (loading) return <Fragment><br /> <br /> <Loading size={30} /></Fragment>;
    if (error) return <p>`Error! ${error.message}`</p>;

    return (
        <InfiniteScroll
            dataLength={data?.tweets?.tweets?.length || 0}
            next={() => {
                setPage(page + 1);
                return fetchMore({
                    variables: {
                        userId: props.id,
                        isSFW: sfw.SFW.value,
                        page: page + 1,
                        filter: filter
                    },
                });
            }}
            style={{
                overflow: "hidden"
            }}
            hasMore={data?.tweets?.totalCount > page * 10 || false}
            loader={<Loading />}
        >
            {data.tweets.tweets.map((tweet: TweetData) => {
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
};

export default TweetList;
