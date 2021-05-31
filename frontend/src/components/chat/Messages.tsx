
// import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css';
import React, { Fragment, useRef, useState } from "react"
// import ReactEmoji from 'react-emoji';
 
const Message = (props:any) => {

  let isSentByCurrentUser = false;

  const trimmedName = props.name;

  if(props.message.user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            {/* <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p> */}
            <p className="messageText colorWhite"> { props.message.text }</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              {/* <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p> */}
              <p className="messageText colorWhite"> { props.message.text }</p>
            </div>
            <p className="sentText pl-10 ">{props.message.user}</p>
          </div>
        )
  );
}

const Messages = (props:any) => {
  // <ScrollToBottom className="messages">
  // const [messages, setMessages] = useState([{message:{text:"hi", user:"toka"} , name:"aya"}]);
  // const messages = props.messages
 return <div>
    {props.messages.map((message:any, i:any) => <div key={i}><Message message={message} name={props.name}/></div>)}

  </div>
};

export default Messages;