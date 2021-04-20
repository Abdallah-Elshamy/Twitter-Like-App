
import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";

import { timeConverter } from '../../common/utils/timestamp';
import { FlootProfile } from '../sideBar/flootProfile/flootProfile';
import { ToolBox } from '../sideBar/toolbox/toolbox';

export interface TweetData {
  user?: {
    id: string
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


const Tweet: React.FC<TweetData> = (props) => (


  <div className="tweet-box ">

    <div className="tweet-icon mr-2">
      {props.user?.imageURL ? (
        <img src={props.user?.imageURL}
          alt="avatar" />
      ) : (<img src={avatar} alt="avatar" />)}
    </div>
    <div className="tweet-aside">
      <div className="tweet-data py-1">
        <p className="font-bold mr-1">{props.user?.name}</p>
        <p className="p--light-color"> @{props.user?.userName} . </p>
        <p className="p--light-color px-1"> {props.createdAt ? timeConverter(Number(props.createdAt)) : null}</p>
        <span className="tweet-ellipsis p--light-color">
          <i className="fas fa-ellipsis-h"></i>
        </span>
      </div>
      <div className="tweet-content">
        <span>
          {props.text}
        </span>
        <div className="tweet-toolbar p--light-color  ">
          <a href="/">
            <i className="fas fa-reply text-base font-sm "></i>
            <span>{props.repliesCount}</span>
          </a>

          <a>
            {/* <ToolBox className="fixed">
          <ul className= "mb-40  absolute ml-16" >
          <a href="/profile" className="mt-1 w-24 text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
          hover:text-gray-900  hover:rounded-full rounded-full" role="menuitem">Retweet</a>
          <a href="/profile" className="mt-1 w-24  text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
          hover:text-gray-900 hover:rounded-full rounded-full" role="menuitem">quote Retweet</a>
          </ul>
            </ToolBox> */}
            <i className="fas fa-retweet text-base font-sm"></i>
            <span>2</span>
          </a>

          <a href="/">
            <i className="far fa-heart text-base font-sm"></i>
            <span>{props.likesCount}</span>
          </a>
        </div>
      </div>
    </div>

  </div>
);

export default Tweet