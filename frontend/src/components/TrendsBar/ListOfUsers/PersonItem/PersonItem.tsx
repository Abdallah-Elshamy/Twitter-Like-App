import React, { Fragment } from 'react';
import { ToolBox } from "../../../sideBar/toolbox/toolbox"
import { PersonEntity } from '../../../../common/TypesAndInterfaces';
import { useMutation } from "@apollo/client"
import './PersonItem.css'
import '../../../profile/profile.css'
import FollowButton from '../../../FollowButton/FollowButton';
import { parseJwt } from '../../../../common/decode';
import { useHistory, useLocation } from 'react-router';
import BanUser from "../../../../common/queries/banUser"
import UnbanUser from "../../../../common/queries/unbanUser"
import ReportUser from "../../../../common/queries/reportUser"
import IgnoreReportedUser from "../../../../common/queries/ignoreReportedUser"
import { updateUsersCacheForBanUser, updateUsersCacheForIgnoreReportedUser, updateUsersCacheForUnBanUser, updateUsersCacheForReportUser } from "../../../../common/utils/writeCache"
import { CustomDialog } from 'react-st-modal'
import DangerConfirmationDialog from "../../../../UI/Dialogs/DangerConfirmationDialog"
import ErrorDialog from "../../../../UI/Dialogs/ErroDialog"


<<<<<<< HEAD
const TrendItem: React.FC<PersonEntity> = ({ id, bio, isFollowing, name, userName, followed = false, imageURL, numberOfFollowers, loggedUser, user }) => {
=======
const TrendItem: React.FC<PersonEntity> = ({ id, bio, isFollowing, name, username, followed = false, imageURI, numberOfFollowers, loggedUser, user, fromChat }) => {
>>>>>>> 578a584023afcd46a0bfd77f40d9c2586f9d31b4
  const history = useHistory();
  const location = useLocation();
  const [banUser] = useMutation(BanUser, {
    update(cache) {
      updateUsersCacheForBanUser(cache, user)
    }
  })
  const [unbanUser] = useMutation(UnbanUser, {
    update(cache) {
      updateUsersCacheForUnBanUser(cache, user)
    }
  })
  const [reportUser] = useMutation(ReportUser, {
    update(cache) {
      updateUsersCacheForReportUser(cache, user)
    }
  })
  const [ignoreReportedUser] = useMutation(IgnoreReportedUser, {
    update(cache) {
      updateUsersCacheForIgnoreReportedUser(cache, user)
    }
  })

  const goToProfile = () => {
    history.push({
      pathname: '/' + id,
    })

  }
  const handleToolBoxButtons = async (e: any, func: any, message: any, title: any) => {
    e.stopPropagation();
    try {
      const result = await CustomDialog(<DangerConfirmationDialog message={message} />, {
        title,
        showCloseIcon: false,
      });
      if (result) {
        await func({
          variables: {
            userId: id
          }
        })
      }
    }
    catch (e) {
      const error = await CustomDialog(<ErrorDialog message={e.message} />, {
        title: 'Error!',
        showCloseIcon: false,
      });
    }
  }
  const handleBanButton = (e: any) => {
    handleToolBoxButtons(e, banUser, "Are you sure you want to ban this user?", "Confirm Ban")
  }
  const handleIgnoreButton = (e: any) => {
    handleToolBoxButtons(e, ignoreReportedUser, "Are you sure you want to ignore this reported user?", "Confirm Ignore")
  }
  const handleUnbanButton = (e: any) => {
    handleToolBoxButtons(e, unbanUser, "Are you sure you want to unban this user?", "Confirm Unban")
  }
  const handleReportUserButton = (e: any) => {
    handleToolBoxButtons(e, reportUser, "Are you sure you want to report this user?", "Confirm Report")
  }
  const profilePicture = (imageURL === undefined || imageURL === null) ?
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg> :
    <img className="rounded-full w-full" src={imageURL} alt="user" />;
  return (

    <div className=" person-item flex  justify-between items-start p-3 hover:bg-gray-100 relative cursor-pointer" onClick={goToProfile}>

      <div className="person-item-image w-11 h-11  rounded-full  flex-none mr-2 ">
        {profilePicture}
      </div>

      <div className="flex-grow">
        <h1 className="person-item-name  text-xm font-bold">{name}</h1>
        <p className="person-item-username"><span className="text-xm">@</span>{userName}</p>
        <p>{bio}</p>
      </div>

      <div className="relative mt-10 left-7">
        {localStorage.getItem('token') && (id == parseJwt(localStorage.getItem('token')).id) ? null :
          <FollowButton id={id} following={isFollowing} user={user}/>}
      </div>
      <ToolBox
        design={
          <i className="fas fa-ellipsis-h hover:bg-gray-400 p-1 px-2 rounded-full cursor-pointer"></i>
        }
      >
        <ul className=" bg-gray-100 mb-40 right-8 absolute  z-10 cursor-pointer " >
          {loggedUser?.isAdmin && loggedUser.id != id && !user?.isBanned ? <button onClick={handleBanButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Ban</button> : loggedUser?.isAdmin && user?.isBanned ? <button onClick={handleUnbanButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          " >Unban</button> : null}
          {loggedUser?.isAdmin && location.pathname.includes("/admin") ? <button onClick={handleIgnoreButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          " >Ignore</button> : null}
          {loggedUser?.id != id && !user.isBanned ? <button onClick={handleReportUserButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Report</button> : null}

        </ul>
      </ToolBox>
    </div>
  )
}
export default TrendItem;

