import CurrentTrends from './CurrentTrends/CurrentTrends';
import FollowRecommendations from './FollowRecommendations/FollowRecommendations';
import SearchBar from './SearchBar/SearchBar';
import Footer from './Footer/Footer'

import './TrendsBar.css'

type Props = {

}
const TrendsBar: React.FC<Props> = (Props) => {


  return (
    <div className="trendsbar px-4 py-2">
      <SearchBar />
      <FollowRecommendations />
      <CurrentTrends />
      <Footer/>
      
    </div>
  )
}
export default TrendsBar;
