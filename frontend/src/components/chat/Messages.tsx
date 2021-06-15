import { useQuery, useSubscription } from '@apollo/client';
import { CHAT_HISTORY } from "../../common/queries/getChatHistory"
import SEND_MESSAGE_sub from '../../common/queries/getChatSubscription';
import FoF from '../../UI/FoF/FoF';
import Loading from '../../UI/Loading';

import './Chat.css';

const Messages: React.FC<any> = ({ userID }) => {

  const { data, loading, error } = useQuery(CHAT_HISTORY, {
    variables: { otherUserId: userID }
  })
  console.log(userID)


  const { data: subData } = useSubscription(SEND_MESSAGE_sub, {
    onSubscriptionData() {
      console.log("arrive Message")
    }
  })
  subData && console.log("sub data", subData)

  if (userID == "-1" || userID == null) return <Loading />
  if (userID == "0") return <FoF fof={false} msg={"You don't have any message"} secMsg={"try searching for some user"} />

  if (!loading) console.log(data)

  return (

    <div>

      { (!loading) && data && [...data.getChatHistory.messages].reverse().map((message: any) => {
        return (
          <div className="messages" key={message.id}>
            <Message message={message.message} user={message.from.id} otherUserId={userID} />
          </div>
        );
      })
      }
      { (subData) ? (<div><p> {subData.messageSent.message}</p></div>) : null}

    </div>
  )
};


const Message = (props: any) => {

  let otherUser = false;

  if (props.user == props.otherUserId) {
    otherUser = true;
  }

  return (
    !otherUser
      ?
      (
        <div className="messageContainer justifyEnd">
          <div className="messageBoxS backgroundBlue">
            <p className="messageText">
              {props.message}
            </p>

          </div>
        </div>
      )
      : (
        <div className="messageContainer justifyStart">
          <div className="messageBoxR backgroundLight">
            <p className="messageText" style={{ color: "black" }}> {props.message}</p>
          </div>
        </div>
      )
  );
}



export default Messages;
