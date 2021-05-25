import './tweet.css';
import TweetImg from './TweetImg';
import { Link, useHistory } from 'react-router-dom';
import TweetInfo from './TweetInfo';
function QuotedTweet({ OTweet }: any) {

  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + OTweet.id,
    })
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
                  {OTweet.text}
                </span>

              </div>
            </div>

          </div>

        </div>
        {/* the end of tweet */}
      </div>


    default:
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
                {OTweet.text}

                {(OTweet.state === 'Q' && OTweet && OTweet.originalTweet) ?
                  <Link onClick={e => e.stopPropagation()}
                    className="block text-blue-400 hover:undeline hover:text-blue-500"
                    to={`/tweet/${OTweet.originalTweet.id}`}>{`domain.com/tweet/${OTweet.originalTweet.id}`}</Link> : null}
              </span>
            </div>
          </div>
        </div>
      </div>
  }

}
export default QuotedTweet;