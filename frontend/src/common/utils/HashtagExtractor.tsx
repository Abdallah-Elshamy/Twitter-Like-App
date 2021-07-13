import React from 'react'
import ReactHtmlParser from 'react-html-parser';

type props = {
  tweet: string
}

const HashtagExtractor: React.FC<props> = (props) => {
  //flag indecates if wee are in hashtag
  var regexp = new RegExp('#([^\\s]*)', 'g');
  let tweet = props.tweet.replace(regexp, `
  <span class="text-blue-500 pointer hover:text-blue-400" 
  onClick={ gotoHashtag}>#$1</span>
  `);
  console.log(tweet)
  return (
    <div >{ReactHtmlParser(tweet)}</div>
  );
};



export default HashtagExtractor
