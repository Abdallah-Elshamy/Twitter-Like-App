import { useQuery } from "@apollo/client";
import React from "react";
import { LoggedUser } from "../../common/queries/Userqery";
import { parseJwt } from "../../common/decode";
import Loading from "../../UI/Loading";
import FoF from "../../UI/FoF/FoF";
import TrendItem from "../TrendsBar/ListOfUsers/PersonItem/PersonItem";
import { Link, useLocation } from "react-router-dom";

const FollowerList: React.FC = (props) => {
let profile;

 if (localStorage.getItem('token')) {
    profile = parseJwt(localStorage.getItem('token'))
  }


  let ID ;
  let currentId = profile.id

  const location = useLocation();
  const path = location.pathname.split("/")[1];
  
  if (path == "profile" ){
   ID = profile.id
    }
  else {
  ID = path
  }
 
 const { data , loading , error } = useQuery(LoggedUser, { variables: { id: ID , page : 1} });
 if (loading) return (<div className="mt-8" ><Loading /></div>)
 if (error) return <FoF
   msg="This account doesn’t exist"
 />

 
 return (
        <div>
      <header className="top-bar px-3 py-2">
        <span className=" m-3">
          <Link  to="/profile">
            <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
          </Link>

        </span>
        <div>
          <p className="font-extrabold text-lg mt-3 ">Follower list</p>

        </div>
      </header>

      {data.user.followers.users.map((person:any) => {
  return(
    <div>
                  {(person.id != currentId) ?
                    <TrendItem               
                   id={person.id}
                   name={person.name}
                   username={person.userName}
                   followed={person.isFollower}
                   imageURI={person.imageURL}
                   isFollowing={person.isFollowing}
                   bio={person.bio}
                   />:null

                }
          </div>
  );
})}
</div> 
);
};

export default FollowerList;
