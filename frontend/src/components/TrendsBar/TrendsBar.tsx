import React, { Fragment } from 'react';
import CurrentTrends from './CurrentTrends/CurrentTrends';
import FollowRecommendations from './FollowRecommendations/FollowRecommendations';
import SearchBar from './SearchBar/SearchBar';
type Props = {

}
const TrendsBar: React.FC<Props> = (Props) => {


  return (
    <div className="trendsbar px-4 py-2">
      <SearchBar />
      <FollowRecommendations />
      <CurrentTrends />
    </div>
  )
}
export default TrendsBar;
