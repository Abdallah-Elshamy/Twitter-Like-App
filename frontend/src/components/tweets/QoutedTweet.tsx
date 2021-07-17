import './tweet.css';
import TweetImg from './TweetImg';
import { Link, useHistory } from 'react-router-dom';
import TweetInfo from './TweetInfo';
import FoF from '../../UI/FoF/FoF';
import ReactPlayer from 'react-player'
import React, { Fragment, useState } from 'react'
import Viewer from 'react-viewer';
import HashtagExtractor from './HashtagExtractor';


function QuotedTweet({ OTweet }: any) {
  let img:any =[]
  const [ visible, setVisible ] = useState(false);
  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + OTweet.id,
    })
  }

if (!OTweet ){
  return <FoF fof={false} secMsg = "This tweet may be deleted by it's author" />
}
const displayUploadedFiles=(urls:string[])=> {
  if (urls.length > 0){ 
  if (urls[0].includes(".com/videos/")){
    return <div style={{height:"300px"}} >
    <ReactPlayer url={urls[0]} height="300px" width="500px"  controls={true}/>
    </div>
  }
  else {
  const check = (urls.length == 3)? true : false
  img = urls.map ((url)=> {return {src:url}})
  return  (
    <Fragment>
      {urls.map((url, i) =>
    <img 
    className="Img"
    style={{gridRow:(check && (i==1))?" 1/3":"",
    gridColumn: (check && (i==1))?" 2/3":"", 
    height: ((check && (i==1)) || (urls.length == 1 && i == 0) || (urls.length ==2) )?"300px":"", 
    objectFit: "cover"}} 
    key={i}  src={url} onClick={(e) => {e.stopPropagation(); setVisible(true); }}  alt="tweet"/>
    )}
    <Viewer
    visible={visible}
    onClose={() => { setVisible(false); } }
    images={img}
    drag={false}
    />
    </Fragment>
    )}}

}

  switch (OTweet.state) {

    case "C":
      return <div>

        {/* the tweet */}
        <div>
          <div className="flex w-full flex-row border 
     hover:bg-gray-100 border-gray-200 rounded-md p-2"
            onClick={e => { goToTweet(); e.stopPropagation() }}>
            <TweetImg imageURL={OTweet.user.imageURL} className="tweet-small-icon mt-2" />

            <div className="tweet-aside">
              <TweetInfo
                userName={OTweet.user?.userName}
                createdAt={OTweet.createdAt}
                name={OTweet.user?.name}
                type="Q"
              />

              {/* the added design of Reply design  */}
              <div className="space-x-2 -mt-2 -ml-10">
                <p className=" p--light-color ml-12 inline-block"> Repling to  </p>
                <Link onClick={e => { e.stopPropagation() }}
                  to={"/" + OTweet.repliedToTweet.id}
                  className="text-blue-500 inline-block hover:underline">
                  @{OTweet.repliedToTweet.user?.userName}</Link>
              </div>

              {/* the text/media of the original tweet */}
              <div className="tweet-content pb-4 pt-2">
                <span>
                  {}
                <HashtagExtractor tweet={OTweet.text + ''} />
                </span>
                {(OTweet.mediaURLs) && 
                <div className="gg-box-small" onClick={(e) => e.stopPropagation()}>

                { displayUploadedFiles(OTweet.mediaURLs) }

              </div>}

              </div>
            </div>

          </div>

        </div>
        {/* the end of tweet */}
      </div>


    case "O":
    case "Q":
      return <div>
        <div className="flex  w-full flex-row border 
    hover:bg-gray-100 border-gray-200 rounded-md p-2"
          onClick={e => { goToTweet(); e.stopPropagation() }}>

          <TweetImg imageURL={OTweet.user && OTweet.user.imageURL} id={OTweet.user?.id} className="tweet-small-icon " />

          <div className="w-full">
            <TweetInfo
              id={OTweet.user.id}
              userName={OTweet.user?.userName}
              createdAt={OTweet.createdAt}
              name={OTweet.user?.name}
              type="Q"
            />

            {/* the text/media of the original tweet */}
            <div className="tweet-content mx-2 pb-4 pt-2">
              <span>
                <HashtagExtractor tweet={OTweet.text + ''} />
                {(OTweet.mediaURLs) && 
                <div className="gg-box-small" onClick={(e) => e.stopPropagation()}>

                { displayUploadedFiles(OTweet.mediaURLs) }

              </div>}

                {(OTweet.state === 'Q' && OTweet && OTweet.originalTweet) ?
                  <Link onClick={e => e.stopPropagation()}
                    className="block text-blue-400 hover:undeline hover:text-blue-500"
                    to={`/tweet/${OTweet.originalTweet.id}`}>{`domain.com/tweet/${OTweet.originalTweet.id}`}</Link> : null}
              </span>
              
              
            </div>
          </div>
        </div>
      </div>

    default:
      return <FoF fof={false} msg="This tweet may be deleted by it's author" />
  }

}


export default QuotedTweet;
