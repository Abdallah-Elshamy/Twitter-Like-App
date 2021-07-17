import CurrentTrends from './CurrentTrends/CurrentTrends';
import SearchBar from './SearchBar/SearchBar';
import Footer from './Footer/Footer'

import './TrendsBar.css'
import { PersonEntity } from '../../common/TypesAndInterfaces';
import SideList from '../../UI/SideList/SideList';
import { useLocation } from 'react-router-dom';
import React from 'react';
import ListOfUsers from './ListOfUsers/listofusers';



type Props = {

}
const TrendsBar: React.FC<Props> = () => {
  const location = useLocation()

  const followRec: PersonEntity[] = [
    {
      id: "100",
      name: 'Amr',
      userName: 'amrhafez',
      followed: false

    }, {
      id: "55",
      name: 'Eslam',
      userName: 'eslam_ahmed',
      followed: false,
      imageURL: "https://pbs.twimg.com/profile_images/1290039411317575682/M-Wa8fmE_400x400.jpg"

    }
    , {
      id: "55",
      name: 'John Doe',
      userName: 'jo_doe',
      followed: false,
      imageURL: "https://pbs.twimg.com/profile_images/1333063820311293952/wb0ciEAn_400x400.jpg"

    },

  ]

  const searchbar =
    !location.pathname.includes('/explore') ? <SearchBar /> : null

  return (

    <div className="trendsbar px-4 hidden lg:block ">
      <div className="mt-4 ">{searchbar}</div>
      <SideList title="Who to follow " redirect="/" >
        <ListOfUsers list={followRec} />
      </SideList>
      <SideList title="What's happening now " redirect="/explore" >
        <CurrentTrends limit={3} />
      </SideList>
      <Footer />

    </div>
  )
}
export default TrendsBar;
