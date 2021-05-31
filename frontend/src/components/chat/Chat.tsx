import React, { useState, useEffect } from "react";
// import queryString from 'query-string';
// import io from "socket.io-client";

import Messages from './Messages';
import InfoBar from './InfoBar';
import Input from './Input';

import './Chat.css';

// const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

// let socket;

const ChatWindow = () => {
  const [name, setName] = useState('name');
  const [room, setRoom] = useState <string>('room');
  const [users, setUsers] = useState('Aya');
  const [message, setMessage] = useState({message:{text:"hiM", user:"tokaM" } ,name: "Aya"});

  const [messages, setMessages] = useState([{message:{text:"hi", user:"toka"} ,name: "Aya"} , {message:{text:"hi", user:"toka"} ,name: "Aya"}]);

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
          {/* <Messages /> */}
          <Messages messages={messages} name={name}/>


          <Input message={message.message.text} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;