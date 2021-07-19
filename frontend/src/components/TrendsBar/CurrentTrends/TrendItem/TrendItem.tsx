import React from 'react';
import { useHistory } from 'react-router';

import { Trend } from '../../../../common/TypesAndInterfaces';

import './TrendItem.css'

const TrendItem: React.FC<Trend> = ({ trendName, numOfTweets }) => {
  const history = useHistory();

  const gotoHashtag = () => {
    history.push({
      pathname: '/hashtag/' + trendName,
    })

  }
  return (
    <div className="trend-item flex cursor-pointer justify-between items-center p-3 w-full " onClick={(e) => { gotoHashtag(); e.stopPropagation() }}>
      <div className="trend-info">
        <h1 className="trend-name mb-1 text-xm font-bold">#{trendName}</h1>
        <p>{numOfTweets}</p>
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
