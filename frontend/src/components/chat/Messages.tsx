import { useQuery } from '@apollo/client';
import { CHAT_HISTORY } from "../../common/queries/getChatHistory"
import FoF from '../../UI/FoF/FoF';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../../UI/Loading';
import { useRef, useEffect } from "react"
import { setUnseenConvToZero, liveSetUnseenConvToZero } from "../../common/utils/writeCache"

import './Chat.css';

const Messages: React.FC<any> = ({ userID }) => {

  const { data, loading, fetchMore } = useQuery(CHAT_HISTORY, {
    variables: { otherUserId: userID, page: 1 }
  })

  const messagesEndRef = useRef<any>(null)
  const listInnerRef = useRef<any>()

  const scrollToBottom = () => {
    if (!messagesEndRef || !messagesEndRef?.current) return;
    const { scrollTop } = listInnerRef?.current
    if (scrollTop > -5 && scrollTop < 5) {
      liveSetUnseenConvToZero(data?.getChatHistory?.messages[0]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

  }
  const onReachedBottom = () => {
    if (!messagesEndRef || !messagesEndRef?.current) return;
    const { scrollTop } = listInnerRef?.current
    if (scrollTop > -5 && scrollTop < 5) {
      setUnseenConvToZero(userID)
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [data]);
  if (userID == "-1" || userID == null) return <Loading size="20" />
  if (userID == "0") return <FoF fof={false} msg={"You don't have any message"} secMsg={"try searching for some user"} />

  if (loading) return <Loading></Loading>
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
      height: "95vh", overflow: "auto", display: 'flex',
      flexDirection: 'column-reverse',
    }} className="relative" ref={listInnerRef} onScroll={onReachedBottom}>
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
        className="pb-24 h-screen mt-10"
        hasMore={data?.getChatHistory?.totalCount > data?.getChatHistory?.messages?.length || false}
        loader={<Loading />}
        scrollableTarget="scrollableChat"
      >
        {data && [...data?.getChatHistory?.messages].reverse().map((message: any) => {
          return (
            <div className="messages" key={message.id}  >
              <Message message={message.message} user={message.from.id} otherUserId={userID} />
            </div>
          );
        })}


      </InfiniteScroll>

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
