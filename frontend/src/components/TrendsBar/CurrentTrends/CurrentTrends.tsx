import React, { Fragment } from 'react';
import { Trend } from '../../../common/TypesAndInterfaces';
import SideList from '../../../UI/SideList/SideList';
import TrendItem from './TrendItem/TrendItem';


const CurrentTrends: React.FC = () => {
  const trends:Trend[]=[
    {
      trendName:'El Ahly',
      numOfTweets:5500
    },{
      trendName:'Omar',
      numOfTweets:550
    },
    {
      trendName:'Aballah',
      numOfTweets:55000
    }
  ]

const trendsList = trends.map((trend)=>{
  return (<TrendItem 
    key = {trend.trendName} trendName = {trend.trendName} numOfTweets = {trend.numOfTweets}
  />)
})

  return (
    <Fragment>   
         {trendsList}
    </Fragment>

  )
}
export default CurrentTrends;
