//design of quoted retweet


import React from 'react'
import './tweet.css';
import Tweet_img from './Tweet_img';
import Tweet_toolbarIcons from './Tweet_toolbarIcons';
import Tweet_Info from './Tweet_Info';
import { Link, useHistory } from 'react-router-dom';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { GET_SINGLE_TWEET } from '../../common/queries/GET_SINGLE_TWEET';
import { Get_SFW } from '../../common/queries/GET_SFW';


function QuotedTweet({ OTweet }: any) {
  /*const sfw = useQuery(Get_SFW).data;
  const [getData, { data, loading }] = useLazyQuery(GET_SINGLE_TWEET)
  if (OTweet.state === 'Q') {
    getData({
      variables: {
        tweetId: OTweet.id,
        isSFW: sfw.SFW.value,
      }
    })
  }*/
  const history = useHistory();
  //redirect to tweet
  const goToTweet = () => {
    history.push({
      pathname: '/tweet/' + OTweet.id,
    })
  }

  return (

    <div className="flex  w-full flex-row border 
    hover:bg-gray-100 border-gray-200 rounded-md p-2"
      onClick={e => { goToTweet(); e.stopPropagation() }}>

      <Tweet_img imageURL={OTweet.user && OTweet.user.imageURL} id={OTweet.user?.id} className="tweet-small-icon " />

      <div className="w-full">
        <Tweet_Info
          id={OTweet.user.id}
          userName={OTweet.user?.userName}
          createdAt={OTweet.createdAt}
          name={OTweet.user?.name}
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

  )
}
export default QuotedTweet;