import './tweet.css';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import deleteTweetMutation from '../../common/queries/deleteTweet'
import IgnoreReportedTweet from "../../common/queries/ignoreReportedTweet"
import BanUser from "../../common/queries/banUser"
import UnbanUser from "../../common/queries/unbanUser"
import ReportTweet from "../../common/queries/reportTweet"
import ReportUser from "../../common/queries/reportUser"
import { DeleteMedia } from '../../common/queries/DeleteMedia'
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from "@apollo/client"
import { CustomDialog } from 'react-st-modal'
import DangerConfirmationDialog from "../../UI/Dialogs/DangerConfirmationDialog"
import ErrorDialog from "../../UI/Dialogs/ErroDialog"
import {updateTweetsCacheForDeleteTweet, updateTweetsCacheForIgnoreReportedTweet, updateUsersCacheForBanUser, updateUsersCacheForUnBanUser, updateTweetsCacheForReportTweet, updateUsersCacheForReportUser} from "../../common/utils/writeCache"
import { timeDiff } from '../../common/utils/timediff';
export interface TweetData {
  user?: {
    imageURL?: string
    name?: string
    userName?: string
  }
  id?: string
  text: string
  likesCount?: number
  repliesCount?: number
  createdAt?: number
  isLiked?: boolean
}

function TweetInfo(props: any) {
  const history = useHistory();
  const location = useLocation()
  const { tweet } = props
  const [deleteMedia] = useMutation(DeleteMedia)
  const [banUser] = useMutation(BanUser, {
    update(cache) {
      updateUsersCacheForBanUser(cache, tweet.user)
    }
  })
  const [reportUser] = useMutation(ReportUser, {
    update(cache) {
      updateUsersCacheForReportUser(cache, tweet.user)
    }
  })
  const [unbanUser] = useMutation(UnbanUser, {
    update(cache) {
      updateUsersCacheForUnBanUser(cache, tweet.user)
    }
  })
  const [deleteTweet] = useMutation(deleteTweetMutation, {
    update(cache) {
      const normalizedId = cache.identify({
        id: tweet.id,
        __typename: "Tweet",
    });
    if (normalizedId) {
      cache.evict({ id: normalizedId });
      updateTweetsCacheForDeleteTweet(cache, tweet)
    }
  }})
  const [ignoreTweet] = useMutation(IgnoreReportedTweet, {
    update(cache) {
      updateTweetsCacheForIgnoreReportedTweet(cache, tweet)
    }
  })
  const [reportTweet] = useMutation(ReportTweet, {
    update(cache) {
      updateTweetsCacheForReportTweet(cache, tweet)
    }
  })

  const goToProfile = () => {
    history.replace({
      pathname: '/' + props.id,

    })
  }
  const handleDeleteButton = async() => {
    try {
      const result = await CustomDialog(<DangerConfirmationDialog message="Are you sure you want to delete this tweet?"/>, {
        title: 'Confirm Delete',
        showCloseIcon: false,
      });
      if (result) {
        await deleteTweet({
          variables: {
            id: props.tweetId
          }
        })
        tweet.mediaURLs.forEach((mediaURL: any) => {
            deleteMedia({
              variables:{
                id: mediaURL.split('/')[3]
              }
            })
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
  const handleToolBoxButtons = async(e: any, func:any, message:any, title:any) => {
    try {
      const result = await CustomDialog(<DangerConfirmationDialog message={message}/>, {
        title,
        showCloseIcon: false,
      });
      if (result) {
        await func({
          variables: {
            userId: tweet?.user?.id,
            id: tweet?.id
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
  const handleIgnoreButton = (e: any) => {
    handleToolBoxButtons(e, ignoreTweet, "Are you sure you want to ignore this reported tweet?", "Confirm Ignore")
  }

  const handleBanButton = (e:any) => {
    handleToolBoxButtons(e, banUser, "Are you sure you want to ban this user?", "Confirm Ban")
  }

  const handleUnbanButton = (e: any) => {
    handleToolBoxButtons(e, unbanUser, "Are you sure you want to unban this user?", "Confirm Unban")
  }
  const handleReportTweetButton = (e: any) => {
    handleToolBoxButtons(e, reportTweet, "Are you sure you want to report this tweet?", "Confirm Report")
  }

  const handleReportUserButton = (e: any) => {
    handleToolBoxButtons(e, reportUser, "Are you sure you want to report this user?", "Confirm Report")
  }
  return (

    <div className={`flex flex-row my-1 ml-2  w-full ${props.className}`}>
      <a onClick={(e) => { goToProfile(); e.stopPropagation() }} className="font-bold mr-1 hover:underline cursor-pointer">{props.name}</a>
      <p onClick={(e) => { goToProfile(); e.stopPropagation() }} className="p--light-color  hover:underline cursor-pointer" > @{props.userName}. </p>
      <p className="p--light-color px-1 hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}> {props.createdAt ? timeDiff(Number(props.createdAt)) : null}</p>
      <span onClick={(e) => e.stopPropagation()} className="tweet-ellipsis p--light-color z-10 inline-block float-right">

        {/*Don't display settings in qouted tweet*/}
        {(props.type === 'Q') ? null :
          <ToolBox
            design={<i className="fas fa-ellipsis-h hover:p-2 rounded-full p-1 px-2 hover:bg-gray-200"></i>}
          >
            <ul className=" bg-gray-100 mb-40 right-8 absolute z-10 cursor-pointer" >
          {props?.loggedUser?.isAdmin && props?.loggedUser?.id != tweet?.user?.id && !tweet?.user?.isBanned ? <button onClick={handleBanButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Ban</button>: props?.loggedUser?.isAdmin && tweet?.user?.isBanned ? <button onClick={handleUnbanButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          " >Unban</button>: null}
          {props?.loggedUser?.id == props?.tweet?.user?.id || props?.loggedUser?.isAdmin ? <button onClick={handleDeleteButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Delete</button>: null}
          {props?.loggedUser?.isAdmin &&  location.pathname.includes("/admin/reported-tweets") ? <button onClick={handleIgnoreButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          " >Ignore</button>: null}
           {props?.loggedUser?.id != tweet?.user?.id? <button onClick={handleReportTweetButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Report Tweet</button>: null}
          {props?.loggedUser?.id != tweet?.user?.id && !tweet?.user?.isBanned? <button onClick={handleReportUserButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Report User</button>: null}

          </ul>
          </ToolBox>}

      </span>
    </div>


  )
}

export default TweetInfo;
