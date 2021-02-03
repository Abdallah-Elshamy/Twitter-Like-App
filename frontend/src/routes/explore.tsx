import React, { Fragment } from 'react';
import { SideBar } from "./../components/sideBar/sideBar" ;
import ProfileInfo from "../components/ProfileInfo"; 
import Tweet from "../components/Tweet"
import TrendsBar from '../components/TrendsBar/TrendsBar';
import '../styles/layout.css'
import {  gql, useQuery } from '@apollo/client';
import SearchBar from '../components/TrendsBar/SearchBar/SearchBar';
import CurrentTrends from '../components/TrendsBar/CurrentTrends/CurrentTrends';




const Explore: React.FC = () => {
  return (
    <Fragment>
        <main className="main-container">
        <aside className="sb-left"><SideBar/></aside>  
        <article className="wall">
          <div className="top-bar p-4" > 
          <SearchBar/>
          </div>
          <CurrentTrends />
          </article>
          <aside className="sb-right"><TrendsBar /></aside>
          
        </main>
    </Fragment>
  );
}

export default Explore;