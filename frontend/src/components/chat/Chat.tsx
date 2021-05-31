import { useState } from "react";
import Messages from './Messages';
import InfoBar from './InfoBar';
import Input from './Input';
import './Chat.css';




const ChatWindow = () => {
  const [name, setName] = useState('name');
  const [room, setRoom] = useState <string>('room');
  const [users, setUsers] = useState('Aya');
  const [message, setMessage] = useState({text: "hiM" , user: "tokaM", name: "AyaM"});


  const [messages, setMessages] = useState([{ message: {text: "hiM" , user: "tokaM"}, name: "AyaM"},
                                            { message: {text: "hiM" , user: "tokaM"}, name: "AyaM"}, 
                                            { message: {text: "hiM" , user: "toka" }, name: "toka"},
                                            { message: {text: "hiM" , user: "toka" }, name: "toka"},
                                            
]);

  const sendMessage = (event:any) => {
    event.preventDefault();
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />

{/* here we send all state as prop we can't acess state element out of component so we send it then acess it in Message component */}
          <Messages messages={messages}/>       
          <Input message={message.text} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;

