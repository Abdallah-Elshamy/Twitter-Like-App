import {  from, useQuery } from '@apollo/client';
import {CHAT_HISTORY} from "../../common/queries/getChatHistory"
import './Chat.css';;

 //message take props <Message message ,  name , user  /> 
//messages take props 'messages' it is list 

const Messages = () => {
  const {data , loading} =useQuery(CHAT_HISTORY , {
    variables:{otherUserId: "8"}
  })
  if(!loading) console.log(data)

 return <div>
   
    { (!loading) && [...data.getChatHistory.messages].reverse().map((message:any) => {
      console.log (message)
        return ( 
      <div  className="messages" key = {message.id}>
         <Message message = {message.message}   user = {message.from.id} /> 
      </div>
      );
    })
    }

  </div>
};


const Message = (props:any) => {

  let otherUser = false;

  const trimmedName = props.name ;

  if(props.user == "8") {
    otherUser = true;
  }

  return (
    !otherUser
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



export default Messages;
