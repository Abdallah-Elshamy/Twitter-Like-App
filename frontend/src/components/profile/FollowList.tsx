import { useQuery } from "@apollo/client";
import React from "react";
import { LoggedUser } from "../../common/queries/Userqery";
import { parseJwt } from "../../common/decode";
import Loading from "../../UI/Loading";
import FoF from "../../UI/FoF/FoF";
import TrendItem from "../TrendsBar/ListOfUsers/PersonItem/PersonItem";
import { Link, useLocation  } from "react-router-dom";
import {updateUserQuery} from "../../common/utils/writeCache"
import InfiniteScroll from "react-infinite-scroll-component";
import PersonItem from "../../components/TrendsBar/ListOfUsers/PersonItem/PersonItem"


export interface FollowType {
  FollowType: string,
}
  const FollowList: React.FC <FollowType> = ({ FollowType:FollowType }) => {
var profile:any;
let ID: any ;

 if (localStorage.getItem('token')) {
    profile = parseJwt(localStorage.getItem('token'))
  }
  let currentId = profile.id

const location = useLocation();
const path = location.pathname.split("/")[1];
if (path == "profile" ){
 ID = profile.id;
  }
else {
ID = path;
}

 const { data , loading , error, fetchMore } = useQuery(LoggedUser, { variables: { id: ID} });
 if (loading) return (<div className="mt-8" ><Loading /></div>)
 if (error) return <FoF msg="This account doesn’t exist"/>

 if (FollowType == "follower" ) 
 {
  if(!loading && data && data?.user?.followers?.users?.length === 10 && data?.user?.followers?.totalCount > 10){
    fetchMore({
        variables: {
            page: 2,
            id: ID,
        },
        updateQuery: updateUserQuery
    })
}
  const list = data?.user?.followers?.users
  return (
    <div>
  <header className="top-bar px-3 py-2">
    <span className=" m-3">
      <Link  to="/profile">
        <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
      </Link>

    </span>
    <div>
      <p className="font-extrabold text-lg mt-3 "> Follower list</p>

    </div>
  </header>
  <InfiniteScroll
            dataLength={list?.length-1 || 0}
            next={() => {
              fetchMore({
                variables: {
                    page: Math.floor((list?.length || 10)/10) + 1,
                    id: ID,
                },
                updateQuery: updateUserQuery
            })
            }}
            hasMore={data?.user?.followers?.totalCount > list?.length || false}
            loader={<Loading />}
            style={{
                overflow: "hidden"
            }}
            className="pb-20"
        >
            {list.map((person: any) => {
                return (
                  (person.id != ID) ?
                    <PersonItem  
                   key ={person.userName}             
                   id={person.id}
                   name={person.name}
                   username={person.userName}
                   followed={person.isFollower}
                   imageURI={person.imageURL}
                   isFollowing={person.isFollowing}
                   bio={person.bio}
                   loggedUser={profile}
                   user={person}
                   />:null
                );
            })}
        </InfiniteScroll>
</div> 
);
 } 
 else {
  if(!loading && data && data?.user?.following?.users?.length === 10 && data?.user?.following?.totalCount > 10){
    fetchMore({
        variables: {
            page: 2,
            id: ID,
        },
        updateQuery: updateUserQuery
    })
}
  const list = data?.user?.following?.users
  return (
    <div>
  <header className="top-bar px-3 py-2">
    <span className=" m-3">
      <Link  to="/profile">
        <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
      </Link>

    </span>
    <div>
      <p className="font-extrabold text-lg mt-3 "> Following list</p>

    </div>
  </header>

  <InfiniteScroll
            dataLength={list?.length-1 || 0}
            next={() => {
              fetchMore({
                variables: {
                    page: Math.floor((list?.length || 10)/10) + 1,
                    id: ID,
                },
                updateQuery: updateUserQuery
            })
            }}
            hasMore={data?.user?.following?.totalCount > list?.length || false}
            loader={<Loading />}
            style={{
                overflow: "hidden"
            }}
            className="pb-20"
        >
            {list.map((person: any) => {
                return (
                  (person.id != ID) ?
                    <PersonItem  
                   key ={person.userName}             
                   id={person.id}
                   name={person.name}
                   username={person.userName}
                   followed={person.isFollower}
                   imageURI={person.imageURL}
                   isFollowing={person.isFollowing}
                   bio={person.bio}
                   user={person}
                   loggedUser={profile}
                   />:null
                );
            })}
        </InfiniteScroll>
</div> 
);
 }
};


export default FollowList;
