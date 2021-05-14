import './tweet.css';
import { timeConverter } from '../../common/utils/timestamp';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import deleteTweetMutation from '../../common/queries/deleteTweet'
import IgnoreReportedTweet from "../../common/queries/ignoreReportedTweet"
import BanUser from "../../common/queries/banUser"
import {DeleteMedia} from '../../common/queries/DeleteMedia'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useMutation } from "@apollo/client"
import {CustomDialog} from 'react-st-modal'
import DangerConfirmationDialog from "../../UI/Dialogs/DangerConfirmationDialog"
import ErrorDialog from "../../UI/Dialogs/ErroDialog"
import {updateTweetsCacheForDeleteTweet, updateTweetsCacheForIgnoreReportedTweet, updateUsersCacheForBanUser} from "../../common/utils/writeCache"

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

function Tweet_Info(props: any) {
  const history = useHistory();
  const location = useLocation()
  console.log("admin path", location.pathname.includes("/admin"))
  const {tweet} = props
  const [deleteMedia] = useMutation(DeleteMedia)
  const [banUser] = useMutation(BanUser, {
    update(cache) {
      updateUsersCacheForBanUser(cache, tweet.user)
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

  const goToProfile = () => {
    history.push({
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
  return (

    <div className="tweet-data py-1">
      <a onClick={(e) => { goToProfile(); e.stopPropagation() }} className="font-bold mr-1">{props.name}</a>
      <p className="p--light-color"> @{props.userName}. </p>
      <a href="/tweet_route" className="p--light-color px-1"> {props.createdAt ? timeConverter(Number(props.createdAt)) : null}</a>
      <span className="tweet-ellipsis p--light-color z-10 ">


        <ToolBox
          design={
            <i className="fas fa-ellipsis-h hover:bg-gray-400 p-1 px-2 rounded-full cursor-pointer"></i>
          }
        >
          <ul className=" bg-gray-100 mb-40 right-8 absolute z-10 cursor-pointer" >
          {props?.loggedUser?.isAdmin && props?.loggedUser?.id != tweet?.user?.id && !tweet?.user?.isBanned ? <button onClick={handleBanButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Ban</button>: props?.loggedUser?.isAdmin && tweet?.user?.isBanned ? <button onClick={handleBanButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          " >Unban</button>: null}
          {props?.loggedUser?.id == props?.tweet?.user?.id || props?.loggedUser?.isAdmin ? <button onClick={handleDeleteButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Delete</button>: null}
          {props?.loggedUser?.isAdmin &&  location.pathname.includes("/admin/reported-tweets") ? <button onClick={handleIgnoreButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          " >Ignore</button>: null}
            <a href="/profile" className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >block</a>
            <a className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" >mute</a>

          </ul>
        </ToolBox>

      </span>
    </div>


  )
}

export default Tweet_Info;