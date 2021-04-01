import React  from "react"
import Tweet, { TweetData } from "../tweets/Tweet";

const handleScrolling = ( onLoadMore:any , e:any ) => {
  let element = e.target
  if ( element.scrollTop === element.clientHeight ) {
    onLoadMore();
    console.log("scrooooll")
  }
}
function Feed  ({ tweet , onLoadMore }:any) {
return (
<ul>
  {
      tweet.map((tweet: TweetData) => {
      return <Tweet text={tweet.text}
        repliesCount={tweet.repliesCount}
        createdAt={tweet.createdAt}
        isLiked={tweet.isLiked}
        user={tweet.user}
        likesCount={tweet.likesCount}
        key={tweet.id} />
    })
    }
    { window.onscroll = ( e:any ) => handleScrolling ( onLoadMore , e )}
</ul >
  );
}

export default Feed;