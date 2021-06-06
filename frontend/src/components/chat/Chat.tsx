import Messages from './Messages';
import Input from './Input';
import './Chat.css';

const ChatWindow = () => {

  const sendMessage = (event:any) => {
    event.preventDefault();
  }

  return (

    <div  style={{height:"100vh", overflow:"scroll"}}>
      <div className="container">
          <Messages />        
      </div>
      <Input/>
    </div>

  );
}

export default ChatWindow;

