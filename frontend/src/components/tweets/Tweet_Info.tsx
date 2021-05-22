import './tweet.css';
import { timeConverter } from '../../common/utils/timestamp';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import deleteTweetMutation from '../../common/queries/deleteTweet'
import { DeleteMedia } from '../../common/queries/DeleteMedia'
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from "@apollo/client"
import { CustomDialog } from 'react-st-modal'
import DeleteConfirmationDialog from "../../UI/Dialogs/DeleteConfirmationDialog"
import ErrorDialog from "../../UI/Dialogs/ErroDialog"
import { updateTweetsCacheForDeleteTweet } from "../../common/utils/writeCache"

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
  const { tweet } = props
  const [deleteMedia] = useMutation(DeleteMedia)
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
    }
  })

  const goToProfile = () => {
    history.push({
      pathname: '/' + props.id,
    })
  }
  const handleDeleteButton = async () => {
    try {
      const result = await CustomDialog(<DeleteConfirmationDialog />, {
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
            variables: {
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
  return (

    <div className={`flex flex-row my-1 px-2 w-full   ${props.className}`}>
      <div></div>
      <a onClick={(e) => { goToProfile(); e.stopPropagation() }} className="font-bold mr-1 hover:underline">{props.name}</a>
      <p className="p--light-color"> @{props.userName}. </p>
      <p className="p--light-color px-1 hover:underline"> {props.createdAt ? timeConverter(Number(props.createdAt)) : null}</p>
      <span className="tweet-ellipsis p--light-color z-10 inline-block float-right">


        <ToolBox
          design={
            <i className="fas fa-ellipsis-h"></i>
          }
        >
          <ul className=" bg-gray-100 mb-40 right-4 absolute bg-gray-100 " >
            {props?.loggedUser?.id == props?.tweet?.user?.id ? <button onClick={handleDeleteButton} className="mt-1 w-40 text-center outline:none block px-4 py-2 text-sm text-red-700 bg-gray-100 hover:bg-gray-200
          " >Delete</button> : null}
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

export default TweetInfo;