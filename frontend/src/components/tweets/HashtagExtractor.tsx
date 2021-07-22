import React, { Fragment } from 'react'

import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
type props = {
  tweet: string
}
type part = {
  hashtag: boolean;
  value: string;
};



let split = (tweet: string): part[] => {
  const parts: part[] = [];
  let word: string = "";
  let isHashtag = false;
  for (let i = 0; i < tweet.length; i++) {
    //if word ended and not empty add it 
    if ((tweet[i] === " " || tweet[i] === "#") && word.length !== 0         ) {
      if (isHashtag || tweet[i] === "#") {
	if(word === '#' ) isHashtag =false
	parts.push({
          hashtag: isHashtag,
          value: word,
        });
        word = "";
      }
    }

    //indicate we are parsing hashtag
    if (tweet[i] === "#") {
      isHashtag = true;
    }

    //indicate we are not parsing hashtag
    if (tweet[i] === " ") {
      isHashtag = false;
    }

    word += tweet[i];
  }
  //add last word
  if (word !== "" ){
	if(word === '#' ) isHashtag =false
    parts.push({
      hashtag: isHashtag,
      value: word,
    });}
  return parts;
};

const HashtagExtractor: React.FC<props> = (props) => {
  const parts = split(props.tweet)
const history = useHistory();

  const gotoHashtag = (hash: string) => {
    history.push({
      pathname: '/hashtag/' + hash,
    })

  }
  return <div>
    {parts.map(i => {
      if (i.hashtag === true) return (
        <span onClick={(e)=>{gotoHashtag(i.value.substr(1).toLowerCase());e.stopPropagation()}} className="text-blue-500 cursor-pointer hover:text-blue-600">{i.value}</span>
      )
      else return <Fragment> {i.value}</Fragment>
    })}
  </div>
};




export default HashtagExtractor
