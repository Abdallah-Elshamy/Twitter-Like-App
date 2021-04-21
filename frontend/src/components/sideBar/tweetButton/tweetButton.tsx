import React, { Component, Fragment } from 'react'

import '../../../App.css';
import '../../../styles/layout.css'
import './tweetButton.css'


interface Button_info {
    name: string ,
    type?:any, 
    className? : string ,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export class TweetButton extends Component<Button_info>{
render() {
  return ( 
  
<Fragment>

    <button  className= {` focus:outline-none 
          transform transition hover:scale-110 duration-300 
          hover:shadow-md sidebar_tw_btn ${this.props.className}`}  
          type= {this.props.type}
          onClick = {this.props.onClick}  >
          <strong className="text-center">{this.props.name}</strong>
    </button>  
</Fragment>
  )

  }
}
