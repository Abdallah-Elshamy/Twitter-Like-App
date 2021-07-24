import { Fragment } from 'react';
import { SideBar } from "../sideBar/sideBar";
import '../../App.css';
import './profile.css';
import TrendsBar from '../TrendsBar/TrendsBar';
import '../../styles/layout.css'
import FollowList from './FollowList';


export interface FollowType {
  FollowType: string,
}
  const FollowWall: React.FC <FollowType> = ({ FollowType:FollowType }) => {
  return (
    <Fragment>

      <main className="main-container">
        <aside className="sb-left">< SideBar /></aside>
        <article className="wall">
         
          <FollowList FollowType={FollowType} /> 
          
          </article>
        <aside className="sb-right">< TrendsBar /></aside>
      </main>
   
    </Fragment>
  );
}

export default FollowWall; 