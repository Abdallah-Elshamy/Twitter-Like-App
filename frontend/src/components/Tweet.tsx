import {  gql, useQuery} from '@apollo/client';
import '../styles/tweet.css';
import avatar from "../routes/mjv-d5z8_400x400.jpg"; 


function Tweet(tweet : any) {
  // const {loading, error, data} = useQuery (Tweet_Data)
  // if (loading) return <p>'Loading .. '</p> 
  // if (error) return <p>`Error! ${error.message}`</p> 
  return (
      <div className="tweet-box">
        {/* <div className="tweet-icon">
          {data.tweet.user.imageURL ?(
                      <img src={data.tweet.user.imageURL}  
                      alt="avatar"/>
          ): (<img src={avatar}/>)}
        </div>
        <div className="tweet-aside">
          <div className="tweet-data">
            <p className="font-bold mr-1">{data.tweet.user.name}</p>
            <p className="p--light-color"> {data.tweet.user.userName}</p>
            <p className="p--light-color">{data.tweet.createdAt}</p>
            <span className="tweet-ellipsis p--light-color">
            <i className="fas fa-ellipsis-h"></i>
            </span>
          </div>
          <div className="tweet-content">
            <span>
              {data.tweet.text}
            </span>
          
          <div className="tweet-toolbar p--light-color ">
            <a href="/">
            <i className="fas fa-reply"></i>
            <span>{data.tweet.repliesCount}</span>
            </a>
            <a href="/">
            <i className="fas fa-retweet"></i>
            <span>2</span>
            </a>
            <a href="/">
            <i className="far fa-heart"></i>
            <span>{data.tweet.likesCount}</span>
            </a>
          </div>
          </div>
        </div>   */}
      </div>
  );
}


export default Tweet;