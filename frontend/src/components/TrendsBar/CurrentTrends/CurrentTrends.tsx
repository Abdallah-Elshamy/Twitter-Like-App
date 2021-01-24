import React from 'react';
import { Trend } from '../../../common/TypesAndInterfaces';
import SideList from '../../../UI/SideList/SideList';
import TrendItem from './TrendItem/TrendItem';
type Props = {
  trends: Trend[]
}
const CurrentTrends: React.FC<Props> = ({trends}) => {
const trendsList = trends.map((trend)=>{
  return (<TrendItem 
    key = {trend.trendName} trendName = {trend.trendName} numOfTweets = {trend.numOfTweets}
  />)
})

  return (
    <SideList title="What's happening now " redirect="/trends" >
        {trendsList}
    </SideList>
  )
}
export default CurrentTrends;
