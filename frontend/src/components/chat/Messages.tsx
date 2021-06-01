import './Chat.css';;

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
          {/* <p className="sentText pr-10">{ trimmedName } </p> */}
          <div className="messageBoxS backgroundBlue">
            <p className="messageText">
               { props.message } 
              </p>

          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBoxR backgroundLight">
              <p className="messageText" style={{color:"black"}}> {props.message}</p>
            </div>
          </div>
        )
  );
}

//messages take props 'messages' it is list 
const Messages = (props:any) => {
 return <div>
    { props.messages.map((message:any , i:any) => {
        return ( 
      <div  className="messages" key = {i}>
         <Message message = {message.message.text} name = {message.name}  user = {message.message.user} /> 
      </div>
      );
    })}

  </div>
};

export default Messages;
