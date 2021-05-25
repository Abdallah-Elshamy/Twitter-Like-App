import { useState } from 'react'
import './tweet.css';
import { ToolBox } from '../sideBar/toolbox/toolbox';
import Modal from '../../UI/Modal/Modal';
import deleteTweetMutation from '../../common/queries/deleteTweet'
import PostTweet from './PostTweet';
import { useMutation } from '@apollo/client';
import { RETWEET } from '../../common/queries/RETWEET';
import ErrorDialog from '../../UI/Dialogs/ErroDialog';
import { CustomDialog } from 'react-st-modal';
import DeleteConfirmationDialog from '../../UI/Dialogs/DeleteConfirmationDialog';
import UNRETWEET from '../../common/queries/UNRETWEET';

function TweetToolbarIcons(props: any) {

  const [edit, setEdit] = useState<boolean>(false);
  const modalClosed = () => setEdit(false);
  const [unretweet] = useMutation(UNRETWEET)
  const [retweet, rtData] = useMutation(RETWEET)


  const handleRetweet = async () => {
    try {
      await retweet({ variables: { tweetId: props.tweetId } })
    }
    catch (e) {
      await CustomDialog(<ErrorDialog message={e.message} />, {
        title: 'Error!',
        showCloseIcon: false,
      });
    }
  }
  const handleDeleteButton = async () => {
    try {
      const result = await CustomDialog(<DeleteConfirmationDialog />, {
        title: 'Confirm unretweet',
        showCloseIcon: false,
      });
      if (result) {
        await unretweet({
          variables: {
            tweetId: props.tweetId
          }
        })

      }
    }
    catch (e) {
      await CustomDialog(<ErrorDialog message={e.message} />, {
        title: 'Error!',
        showCloseIcon: false,
      });
    }
  }

  return (

    <div className="tweet-toolbar p--light-color" >
      <Modal show={edit} modalClosed={modalClosed} className="pb-4" >

        <header className="flex justify-between items-center px-3 h-8 w-full border-b border-gray-200 pb-6 pt-2">

          <div onClick={modalClosed} className=" p-1 rounded-full">
            <svg className="h-8 w-5 pt-2 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

        </header>
        <PostTweet />
      </Modal>
      <a onClick={(e) => { setEdit(true); e.stopPropagation() }}>
        <i className="fas fa-reply text-base font-sm " ></i>
        <span>{props.repliesCount}</span>
      </a>

      <a onClick={(e) => e.stopPropagation()}>
        <ToolBox
          design={
            <div className="border-0">
              <i className={`fas fa-retweet text-base font-sm  ${props.isRetweeted ? "text-green-500" : ""}`}></i>
              <span>{Number(props.quotedRetweetsCount + props.retweetsCount)} </span>
            </div>
          }
        >
          <ul className="mb-40 absolute ml-12 bg-gray-100">

            {!props.isRetweeted ?
              <button onClick={() => {
                handleRetweet();
              }} className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" disabled={rtData && rtData.loading} >Retweet</button>
              :
              <button onClick={() => {
                handleDeleteButton()
              }} className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" disabled={rtData && rtData.loading} >Undo retweet</button>
            }
            <a className="mt-1 w-40 text-center block px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200
          hover:text-gray-900" onClick={(e) => { setEdit(true); e.stopPropagation() }}>quote Retweet</a>

          </ul>
        </ToolBox>
      </a>

      <a onClick={(e) => e.stopPropagation()}>
        <i className="far fa-heart text-base font-sm"></i>
        <span>{props.likesCount}</span>
      </a>

    </div>

  )
}
export default TweetToolbarIcons;