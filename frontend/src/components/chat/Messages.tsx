import './Chat.css';

 //message take props <Message message ,  name , user  /> 
const Message = (props:any) => {

  let isSentByCurrentUser = false;

  const trimmedName = props.name ;

  if(props.user == trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? 
      (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{ trimmedName } </p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">
               { props.message } 
              </p>

          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorWhite"> {props.message}</p>
            </div>
            <p className="sentText pl-10 ">{ props.user }</p>
          </div>
        )
  );
}

//messages take props 'messages' it is list 
const Messages = (props:any) => {
 return <div>
    { props.messages.map((message:any) => {
        return ( 
      <div  className="messages">
         <Message message = {message.message.text} name = {message.name}  user = {message.message.user} /> 
      </div>
      );
    })}
  </div>
};

export default Messages;