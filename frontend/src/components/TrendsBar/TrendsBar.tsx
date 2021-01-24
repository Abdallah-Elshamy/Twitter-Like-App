import CurrentTrends from './CurrentTrends/CurrentTrends';
import FollowRecommendations from './FollowRecommendations/FollowRecommendations';
import SearchBar from './SearchBar/SearchBar';
import Footer from './Footer/Footer'

import './TrendsBar.css'
import { PersonEntity, Trend } from '../../common/TypesAndInterfaces';

type Props = {

}
const TrendsBar: React.FC<Props> = (Props) => {
  const trends:Trend[]=[
    {
      trendName:'Eslam',
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

   const followRec:PersonEntity[]=[
    {
      name:'Amr',
      username:'amrhafez',
      followed:false

    },{
      name:'Eslam',
      username:'eslam_ahmed',
      followed:false,
      imageURI:"https://pbs.twimg.com/profile_images/1290039411317575682/M-Wa8fmE_400x400.jpg"

    },
   
  ]

  return (
    <div className="trendsbar px-4 py-2">
      <SearchBar />
      <FollowRecommendations followRec = {followRec} />
      <CurrentTrends trends={trends} />
      <Footer/>
      
    </div>
  )
}
export default TrendsBar;
