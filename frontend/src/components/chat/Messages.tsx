import { useMutation, useQuery, useSubscription } from '@apollo/client';
import ALL_SEEN from '../../common/queries/ALL_SEEN';
import { CHAT_HISTORY } from "../../common/queries/getChatHistory"
import SEND_MESSAGE_sub from '../../common/queries/getChatSubscription';
import FoF from '../../UI/FoF/FoF';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../../UI/Loading';
import { useRef, useEffect } from "react"

import './Chat.css';

const Messages: React.FC<any> = ({ userID }) => {

  const { data, loading, error, fetchMore } = useQuery(CHAT_HISTORY, {
    variables: { otherUserId: userID, page: 1 }
  })
  console.log(userID)
  const [setAllSeen] = useMutation(ALL_SEEN)

  const messagesEndRef = useRef<any>(null)
  const listInnerRef = useRef<any>()
  // const { data: subData } = useSubscription(SEND_MESSAGE_sub, {
  //   onSubscriptionData() {
  //     console.log("arrive Message")
  //   }
  // })
  // subData && console.log("sub data", subData)
  const scrollToBottom = () => {
    if (!messagesEndRef || !messagesEndRef?.current) return;
    const { scrollTop } = listInnerRef?.current
    if (scrollTop === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

  }
  useEffect(() => {
    scrollToBottom()
  }, [data]);
  if (userID == "-1" || userID == null) return <Loading size="20" />
  if (userID == "0") return <FoF fof={false} msg={"You don't have any message"} secMsg={"try searching for some user"} />

  if (loading) return <Loading></Loading>

  const setSeen = () => {
    setAllSeen(
      {
        variables: {
          userId: userID,
        }
      }
    )
  }
  // return (

  //   <div onClick={setSeen} onScroll={setSeen}>

  //     { (!loading) && data && [...data.getChatHistory.messages].reverse().map((message: any) => {
  //       return (
  //         <div className="messages" key={message.id}>
  //           <Message message={message.message} user={message.from.id} otherUserId={userID} />
  //         </div>
  //       );
  //     })
  //     }
  //     { (subData) ? (<div><p> {subData.messageSent.message}</p></div>) : null}

  //   </div>
  // )
  return (
    <div id="scrollableChat" style={{
      height: "100vh", overflow: "auto", display: 'flex',
      flexDirection: 'column-reverse',
    }} className="relative" ref={listInnerRef}>
      <p className="absolute top-0" ref={messagesEndRef}></p>
      <InfiniteScroll
        dataLength={data?.getChatHistory?.messages?.length || 0}
        next={() => {
          return fetchMore({
            variables: {
              otherUserId: userID,
              page: Math.floor((data?.getChatHistory?.messages?.length || 20) / 20) + 1,
            },
          });
        }}
        style={{
          overflow: "hidden"
        }}
        inverse={true}
        className="pb-24 h-screen pt-10"
        hasMore={data?.getChatHistory?.totalCount > data?.getChatHistory?.messages?.length || false}
        loader={<Loading />}
        scrollableTarget="scrollableChat"
      >
        {data && [...data?.getChatHistory?.messages].reverse().map((message: any) => {
          return (
            <div className="messages" key={message.id}  >
              <Message message={message.message} user={message.from.id} otherUserId={userID} />
              <div ></div>
            </div>
          );
        })}


      </InfiniteScroll>
      {/* { (subData) ? (<div><p> {subData.messageSent.message}</p></div>) : null} */}
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
