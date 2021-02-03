import CurrentTrends from './CurrentTrends/CurrentTrends';
import FollowRecommendations from './FollowRecommendations/FollowRecommendations';
import SearchBar from './SearchBar/SearchBar';
import Footer from './Footer/Footer'

import './TrendsBar.css'
import { PersonEntity, Trend } from '../../common/TypesAndInterfaces';
import SideList from '../../UI/SideList/SideList';
import { BrowserRouter, Route, Router, Switch, useLocation, withRouter } from 'react-router-dom';    
import React from 'react';


  
type Props = {

}
const TrendsBar: React.FC<Props> = (Props) => {
   const location = useLocation()

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

  const searchbar =
    location.pathname !== '/explore' ?<SearchBar/>: null
  
  console.log(searchbar)
  return (

    <div className="trendsbar px-4 ">
     <div className="mt-4 ">{searchbar}</div>
      <FollowRecommendations followRec = {followRec} />
      <SideList title="What's happening now " redirect="/trends" >
      <CurrentTrends  />
      </SideList>
      <Footer/>
      
    </div>
  )
}
export default TrendsBar;
