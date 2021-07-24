import { useQuery } from '@apollo/client/react/hooks/useQuery';
import React, { Fragment } from 'react';
import { GET_HASHTAGS } from '../../../common/queries/GET_Hashtags';
import { Trend } from '../../../common/TypesAndInterfaces';
import Loading from '../../../UI/Loading';
import TrendItem from './TrendItem/TrendItem';


const CurrentTrends: React.FC<any> = ({limit=10}) => {


  const { data, loading, error } = useQuery(GET_HASHTAGS, { variables: { page: 0 } })
  if (loading) return <Loading />
  if (error) return <h1 className="text-lg text-center pt-4 text-gray-500">Something went wrong :( </h1>
  const trends = data.hashtags.hashtags
  const trendsList = trends.slice(0,limit).map((trend: any) => {
    return ({
      trendName: trend.word,
      numOfTweets: trend.tweets.totalCount
    })
  }).map((trend: Trend) => (
    <TrendItem
      key={trend.trendName} trendName={trend.trendName} numOfTweets={trend.numOfTweets}
    />
  ))

  return (
    <Fragment>
      {trendsList}
    </Fragment>

  )
}
export default CurrentTrends;
