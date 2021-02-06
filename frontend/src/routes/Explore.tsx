import React, { Fragment } from 'react';
import { SideBar } from "../components/sideBar/sideBar";
import TrendsBar from '../components/TrendsBar/TrendsBar';
import '../styles/layout.css'
import SearchBar from '../components/TrendsBar/SearchBar/SearchBar';
import CurrentTrends from '../components/TrendsBar/CurrentTrends/CurrentTrends';
import { Route, Switch } from 'react-router-dom';
import SearchResult from '../components/SerachResult';


const Explore: React.FC = () => {

  return (
    <Fragment>
      <main className="main-container">
        <aside className="sb-left"><SideBar /></aside>
        <article className="wall">
          <div className="top-bar p-4" >
            <SearchBar />
          </div>


          <Switch>
            <Route path="/explore/trend/:trendname" >
            </Route>

            <Route path={"/explore/results/"} exact  >
              <SearchResult />
            </Route>

            <Route path="/explore" exact>
              <CurrentTrends />
            </Route>
          </Switch>

        </article>
        <aside className="sb-right"><TrendsBar /></aside>

      </main>
    </Fragment >
  );
}

export default Explore;