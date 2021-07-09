import { useMutation } from '@apollo/client';
import { send } from 'process';
import React, { Fragment, useState } from 'react';
import { SEND_MESSAGE } from "../../common/queries/sendMessage"
import {updateChatMessagesForSendMessage} from "../../common/utils/writeCache"
import './Chat.css';



const Input: React.FC<any> = ({ userID }) => {

  const [sendMessage, { data }] = useMutation(SEND_MESSAGE, {
    update: (cache, data) => updateChatMessagesForSendMessage(cache, data)
  });
  const [message, setMessage] = useState("")

  const handleSend = (event: any) => {
    event.preventDefault()
    if (message.length > 0) {
      sendMessage({
        variables: {
          message: {
            toUserId: userID,
            messageBody: message
          }
        }
      });
      console.log(data)
      setMessage("")
    }
  };
  return (
    <Fragment>
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="Type a message...."
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={event => event.key === 'Enter' ? () => handleSend(event) : null}
        />
        <button className="sendButton" onClick={(e) => handleSend(e)}>Send</button>
      </form>
    </Fragment>
  )
}

export default Input;