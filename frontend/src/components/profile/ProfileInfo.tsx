import { useQuery } from '@apollo/client';
import React, { Fragment, useState } from 'react';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import { parseJwt } from '../../common/decode';
import { User } from '../../common/TypesAndInterfaces'
import { LoggedUser } from '../../common/queries/Userqery';
import Modal from '../../UI/Modal/Modal';
import EditProfile from './EditUser/EditProfile';
import { timeConverter } from '../../common/utils/timestamp';
import { EditProfileBgVal, EditProfileImageVal } from '../../common/cache';
import { Link } from 'react-router-dom';
import Viewer from 'react-viewer';


function ProfileInfo() {

  //EDIT PROFILE MODAL
  const [edit, setEdit] = useState<boolean>(false)

  //background viewer
  const [bgVisible, setBgVisible] = useState(false);

  //profile picture viewer
  const [pfVisible, setPfVisible] = useState(false);


  const modalClosed = () => {
    EditProfileImageVal({
      Image: false,
      ImageURL: false
    })
    EditProfileBgVal({
      BgImage: false,
      BgImageURL: false
    })
    setEdit(false)
  }

  if (localStorage.getItem('token') !== null) {
    var profile = parseJwt(localStorage.getItem('token'))
  }

  const {data} = useQuery(LoggedUser, { variables: { id: profile.id } });


  const user: User = data.user;
  return (

    <Fragment>
      <Modal show={edit}
        modalClosed={modalClosed}>
        <EditProfile
          user={user}
          show={edit}
          close={modalClosed} />
      </Modal>

      <header className="top-bar px-3 py-2">
        <span className=" m-3">
          <Link to="/">

            <i className="fa fa-arrow-left  p--main-color" aria-hidden="true"></i>
          </Link>

        </span>
        <div>
          <p className="font-extrabold text-lg ">{user.name}</p>
          {/* featch front tweet */}
          <p className="p--light-color block ">{user.tweets?.totalCount} tweet</p>
        </div>
      </header>

      <div className="pf--container">

        <div className="pf--bg" >
          {user.coverImageURL && (

            <img className="pf--avatar-img" src={user.coverImageURL}
              alt="avatar" onClick={() => user.coverImageURL && setBgVisible(true)} />
          )}
          <Viewer
            visible={bgVisible}
            onClose={() => { setBgVisible(false); }}
            images={[{ src: user.coverImageURL || "", alt: 'background image' }]}
          />

        </div>

        <div className="pf--avatar">

          {
            <img src={user.imageURL || avatar} className="pf--avatar-img"
              alt="avatar" onClick={() => user.imageURL && setPfVisible(true)} />


          }
          <Viewer
            visible={pfVisible}
            onClose={() => { setPfVisible(false); }}
            images={[{ src: user.imageURL || "", alt: 'profile image' }]}
          />
        </div>

        <div className="pf--info">
          <div className="pf--flw-btn-div p-3 h-12">
            < button onClick={() => setEdit(true)} className={"pf--follow-btn rounded-full px-3 font-semibold text-xm  py-2.5 mt-3 "}>
              Edit Profile
            </button >


          </div>
          <div className="mx-2 ">
            <p className="font-extrabold text-lg pb-1 mt-1.5">{user.name} </p>
            <p className="p--light-color block pb-1">@{user.userName}</p>
            <p className="whitespace-pre-wrap ">{user.bio}</p>
            <div className="p--light-color pb-1">
              <span className="pr-2"><i className="fa fa-map-marker" aria-hidden="true"></i> Egypt ... cairo</span>
              <span className="px-2" ><i className="fa fa-gift" aria-hidden="true"></i> Born {user.birthDate} </span>
              <span className="px-2"><i className="fa fa-calendar" aria-hidden="true"></i> Joined {user.createdAt ? timeConverter(Number(user.createdAt), false) : null}</span>
            </div>
            <div className="font-bold pb-1">
              {/* featch followers count  */}
              <a href="/"> {Number(user.followingCount) - 1} <span className="p--light-color mr-4 ">Following</span> </a>
              <a href="/">{Number(user.followersCount) - 1} <span className="p--light-color mr-4">Follower</span> </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProfileInfo;





