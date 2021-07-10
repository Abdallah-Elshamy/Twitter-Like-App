import { useMutation, useQuery, useSubscription } from '@apollo/client';
import ALL_SEEN from '../../common/queries/ALL_SEEN';
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
  const [setAllSeen] = useMutation(ALL_SEEN)


  const { data: subData } = useSubscription(SEND_MESSAGE_sub, {
    onSubscriptionData() {
      console.log("arrive Message")
    }
  })
  subData && console.log("sub data", subData)


  if (loading) return <Loading></Loading>

  const setSeen = () => {
    setAllSeen(
      {
        variables: {
          userId: userID
        }
      }
    )
  }
  return (

    <div onClick={setSeen} onScroll={setSeen}>

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
