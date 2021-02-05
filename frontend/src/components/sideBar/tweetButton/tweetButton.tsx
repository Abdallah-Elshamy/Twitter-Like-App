
import React, { Component } from 'react'
import '../../../App.css';
import '../../../styles/layout.css'
import './tweetButton.css'


interface Button_info {
    name: string ,
    className? : string ,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export class TweetButton extends Component<Button_info>{
render() {
  return ( 
  
  <div> 
    <button className= {`mt-8 focus:outline-none h-12
          transform transition hover:scale-110 duration-300 
          hover:shadow-md sidebar_tw_btn ${this.props.className}`}   onClick = {this.props.onClick}  >
          <strong className="text-center">{this.props.name}</strong>
    </button>  
  </div>
)

}
}