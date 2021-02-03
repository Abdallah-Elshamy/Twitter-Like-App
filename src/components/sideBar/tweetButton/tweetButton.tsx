
import React, { Component } from 'react'
import '../../../App.css';
import '../../../styles/layout.css'
import './tweetButton.css'


interface Button_info {
    name: string
}

export class TweetButton extends Component<Button_info>{
render() {
  return ( 
  
  <div >
        <button className=" pl-28 mt-8 
        text-white text-center focus:outline-none  
         transform transition hover:scale-110 duration-300 
          hover:shadow-md sidebar_tw_btn">
      <strong>{this.props.name}</strong>
    </button>
      
  </div>
)

}
}