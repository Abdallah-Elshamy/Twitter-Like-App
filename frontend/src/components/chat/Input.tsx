import {  useMutation } from '@apollo/client';
import { send } from 'process';
import React, { Fragment , useState} from 'react';
import {SEND_MESSAGE} from "../../common/queries/sendMessage"
import './Chat.css';



const Input = () => {
  const [sendMessage, {data}] = useMutation(SEND_MESSAGE);
  const [message, setMessage] =  useState("")

  const handleSend =  (event:any) => {
    event.preventDefault()
    if (message.length > 0) {
      sendMessage({
        variables: {message: {
          toUserId: "8",
        messageBody: message}
        }
      });
       console.log(data)
      setMessage ("")
    }
  };
  return(
  <Fragment>
    <form className="form ">
        <input
          className="input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={event => event.key === 'Enter' ? ()=> handleSend(event) : null}
        />
        <button className="sendButton" onClick={ (e) => handleSend(e) }>Send</button>
    </form>
  </Fragment>
  )
}

export default Input;