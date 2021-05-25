import { Fragment } from 'react';
import { SideBar } from "../sideBar/sideBar";
import '../../App.css';
import './profile.css';
import TrendsBar from '../TrendsBar/TrendsBar';
import '../../styles/layout.css'
import FollowingList from './FollowingList';
import FollowerList from './followerList';

export interface FollowType {
  FollowType: string,
}
  const FollowWall: React.FC <FollowType> = ({ FollowType:FollowType }) => {
  return (
    <Fragment>

      <main className="main-container">
        <aside className="sb-left">< SideBar /></aside>
        <article className="wall">

        {( FollowType == "follower" ) ?
       <FollowerList/>  : <FollowingList/> }
          
          </article>
        <aside className="sb-right">< TrendsBar /></aside>
      </main>
   
    </Fragment>
  );
}

export default FollowWall; 