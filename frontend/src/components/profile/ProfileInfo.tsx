import { useQuery } from '@apollo/client';
import React, { Fragment, useState } from 'react';
import bg from "../../routes/1500x500.jpeg";
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import FollowButton from '../FollowButton/FollowButton';
import { parseJwt } from '../../common/decode';
import { User } from '../../common/TypesAndInterfaces'
import { LoggedUser } from '../../Userqery';
import EditButton from '../EditButton';
import Modal from '../../UI/Modal/Modal';



function ProfileInfo() {

  var profile;
  if (localStorage.getItem('token') !== null) {
    profile = parseJwt(localStorage.getItem('token'))
  }
  const [edit, setEdit] = useState<boolean>(false)
  const modalClosed = () => setEdit(false)

  const data = useQuery(LoggedUser, { variables: { id: profile.id } }).data;
  const user: User = data.user;
  return (

    <Fragment>
      <Modal show={edit}
        modalClosed={modalClosed}>

      </Modal>
      <header className="top-bar px-3 py-2">
        <span className=" m-3">
          <a href="http://">
            <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
          </a>
        </span>
        <div>
          <p className="font-extrabold text-lg ">{user.name}</p>
          {/* featch fron tweet */}
          <p className="p--light-color block ">{user.tweets?.totalCount} tweet</p>
        </div>
      </header>

      <div className="pf--container">
        <div className="pf--bg" >
          {user.imageURL ? (
            <img src={user.imageURL}
              alt="avatar" />
          ) : (<img src={bg} alt="avatar" />)}

        </div>
        <div className="pf--avatar">
          {user.coverImageURL ? (
            <img className="pf--avatar-img" src={user.coverImageURL}
              alt="avatar" />
          ) : (<img className="pf--avatar-img" src={avatar} alt="avatar" />)}
        </div>

        <div className="pf--info">
          <div className="pf--flw-btn-div p-3 h-12">
            {/*<FollowButton id="1" py="py-1.5" following={false} />*/}
            < button onClick={() => setEdit(true)} className={"pf--follow-btn rounded-full px-3 font-semibold text-xm  py-2.5 mt-3 "}>
              Edit Profile
            </button >


          </div>
          <div className="mx-2 ">
            <p className="font-extrabold text-lg pb-1 mt-1.5">{user.name} </p>
            <p className="p--light-color block pb-1">@{user.userName}</p>
            <p>{user.bio}</p>
            <div className="p--light-color pb-1">
              <span className="pr-2"><i className="fa fa-map-marker" aria-hidden="true"></i> Egypt ... cairo</span>
              <span className="px-2" ><i className="fa fa-gift" aria-hidden="true"></i> Born {user.birthDate} </span>
              <span className="px-2"><i className="fa fa-calendar" aria-hidden="true"></i> Joined {user.createdAt}</span>
            </div>
            <div className="font-bold pb-1">
              {/* featch followers count  */}
              <a href="/"> {user.followingCount} <span className="p--light-color mr-4 ">following</span> </a>
              <a href="/">{user.followersCount} <span className="p--light-color mr-4">Follower</span> </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProfileInfo;





