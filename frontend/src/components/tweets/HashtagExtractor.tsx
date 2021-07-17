import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import {Redirect} from 'react-router-dom'

type props = {
  tweet: string
}

const HashtagExtractor: React.FC<props> = (props) => {

  var regexp = new RegExp('#([^\\s]*)', 'g');
  let tweet = props.tweet.replace(regexp, `
<a href ="/hashtag/$1" onclick ="return false">
<span class="text-blue-500 pointer hover:text-blue-400" 
  >#$1</span></a>  
  `);

  return (
    <div >{ReactHtmlParser(tweet)}</div>
  );
};



export default HashtagExtractor
