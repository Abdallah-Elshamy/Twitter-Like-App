import React, { useState, useEffect } from "react";
// import queryString from 'query-string';
// import io from "socket.io-client";

import Messages from './Messages';
import InfoBar from './InfoBar';
import Input from './Input';

import './Chat.css';

// const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

// let socket;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState <string>('room');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('message');
  const [messages, setMessages] = useState([{message:{text:"hi", user:"toka"}}]);

//   useEffect(() => {
//     const { name, room } = queryString.parse(location.search);

//     socket = io(ENDPOINT);

//     setRoom(room);
//     setName(name)

//     socket.emit('join', { name, room }, (error) => {
//       if(error) {
//         alert(error);
//       }
//     });
//   }, [ENDPOINT, location.search]);
  
//   useEffect(() => {
//     socket.on('message', message => {
//       setMessages(messages => [ ...messages, message ]);
//     });
    
//     socket.on("roomData", ({ users }) => {
//       setUsers(users);
//     });
// }, []);

  const sendMessage = (event:any) => {
    event.preventDefault();

    // if(message) {
    //   socket.emit('sendMessage', message, () => setMessage(''));
    // }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          {/* <Messages messages={messages} name={name} /> */}
          <Messages />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;