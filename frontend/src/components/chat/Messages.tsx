import {  from, useQuery, useSubscription } from '@apollo/client';
import {CHAT_HISTORY} from "../../common/queries/getChatHistory"
import SEND_MESSAGE_sub from '../../common/queries/getChatSubscription';

import './Chat.css';



const Messages = () => {
  const {data , loading} =useQuery(CHAT_HISTORY , {
    variables:{otherUserId: "3"}
  })
  if(!loading) console.log(data)

  const {data: subData} = useSubscription (SEND_MESSAGE_sub, {
    onSubscriptionData() {
        console.log("arrive Message")
    }
})
subData && console.log("sub data", subData)

 return(
 
 <div>
   
    { (!loading) && [...data.getChatHistory.messages].reverse().map((message:any) => {
        return ( 
      <div className="messages" key = {message.id}>
         <Message message = {message.message}   user = {message.from.id} /> 
      </div>
      );
    })
    }

   { (subData ) ? (<div><p> { subData.messageSent.message }</p></div>):null }
   
  </div>  
 )};


const Message = (props:any) => {

  let otherUser = false;

  if(props.user == "3") {
    otherUser = true;
  }

  return (
    !otherUser
      ? 
      (
        <div className="messageContainer justifyEnd">
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
