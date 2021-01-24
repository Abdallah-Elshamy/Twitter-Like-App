import React from 'react';

import { Trend } from '../../../../common/TypesAndInterfaces';

import './TrendItem.css'

const TrendItem: React.FC<Trend> = ({trendName,numOfTweets}) => {
  return (
    <div className="trend-item flex  justify-between items-center p-3">
      <div className="trend-info">
      <h1 className="trend-name mb-1 text-sm font-bold">#{trendName}</h1>
      {(numOfTweets>1000)? <p>{Number(numOfTweets)/1000}k Tweets</p>:null}
      </div>

      <div className="more-icon rounded-full p-1 flex flex-col ">
        <svg className="w-5 h-5" fill="none" stroke="currentColor"
        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <div className="z-10">

          </div>
      </div>
    </div>
  )
}
export default TrendItem;
