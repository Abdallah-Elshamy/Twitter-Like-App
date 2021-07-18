import CurrentTrends from './CurrentTrends/CurrentTrends';
import SearchBar from './SearchBar/SearchBar';
import Footer from './Footer/Footer'

import './TrendsBar.css'

import SideList from '../../UI/SideList/SideList';
import { useLocation } from 'react-router-dom';
import React from 'react';




type Props = {

}
const TrendsBar: React.FC<Props> = () => {
  const location = useLocation()

  
  const searchbar =
    !location.pathname.includes('/explore') ? <SearchBar /> : null

  return (

    <div className="trendsbar px-4 hidden lg:block ">
      <div className="mt-4 ">{searchbar}</div>
      
      <SideList title="What's happening now " redirect="/explore" >
        <CurrentTrends limit={3} />
      </SideList>
      <Footer />

    </div>
  )
}
export default TrendsBar;
