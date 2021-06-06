import Messages from './Messages';
import Input from './Input';
import './Chat.css';

const ChatWindow = () => {

  const sendMessage = (event:any) => {
    event.preventDefault();
  }

  return (
    <div className="outerContainer" style={{height:"100vh", overflow:"scroll"}}>
      <div className="container">
          <Messages />        
          <Input  />
      </div>
    </div>
  );
}

export default ChatWindow;

