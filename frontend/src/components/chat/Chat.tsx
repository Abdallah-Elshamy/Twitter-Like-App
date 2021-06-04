import { useState } from "react";
import Messages from './Messages';
import InfoBar from './InfoBar';
import Input from './Input';
import './Chat.css';




const ChatWindow = () => {
  const [name, setName] = useState('name');
  const [room, setRoom] = useState <string>('room');
  const [users, setUsers] = useState('Aya');
  const [messages, setMessages] = useState([{ message: {text: "hi" , user: "tokaM"}, name: "AyaM"},
                                            { message: {text: "hi" , user: "tokaM"}, name: "AyaM"}, 
                                            { message: {text: "hi" , user: "toka" }, name: "toka"},
                                            { message: {text: "hi" , user: "toka" }, name: "toka"},
                                            { message: {text: "hi" , user: "tokaM"}, name: "AyaM"},
                                            { message: {text: "Winning doesn’t always mean being first. Winning means you’re doing better than you’vedone before" , user: "tokaM"}, name: "AyaM"}, 
                                            { message: {text: "Winning doesn’t always mean being first. Winning means you’re doing better than you’vedone before" , user: "toka" }, name: "toka"},
                                            { message: {text: "hi" , user: "toka" }, name: "toka"},
                                            { message: {text: "hi" , user: "toka" }, name: "toka"},
                                            { message: {text: "hi" , user: "tokaM"}, name: "AyaM"},
                                            { message: {text: "Winning doesn’t always mean being first. Winning means you’re doing better than you’vedone before" , user: "tokaM"}, name: "AyaM"}, 
                                            { message: {text: "Winning doesn’t always mean being first. Winning means you’re doing better than you’vedone before" , user: "toka" }, name: "toka"},
                                            { message: {text: "hi" , user: "toka" }, name: "toka"},
                                            
                                            
]);

  const sendMessage = (event:any) => {
    event.preventDefault();
  }

  return (
    <div className="outerContainer" style={{height:"100vh", overflow:"scroll"}}>
      <div className="container">
{/* here we send all state as prop we can't acess state element out of component so we send it then acess it in Message component */}
          <Messages />       
          <Input  />
      </div>
    </div>
  );
}

export default ChatWindow;

