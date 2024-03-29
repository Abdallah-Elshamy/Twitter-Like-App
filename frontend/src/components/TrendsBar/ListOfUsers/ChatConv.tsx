
import { useQuery } from '@apollo/client';
import React from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../../../UI/Loading';
import ChatItem from './PersonItem/ChatItem';
import { GET_CHAT_CONV } from '../../../common/queries/GET_CHAT_CONV';

interface PersonListProps {
  page: number;
  setPage: any;
}

const ChatConv: React.FC<PersonListProps> = (props) => {
  var unique: any = []

  let { data, loading, error, fetchMore } = useQuery(GET_CHAT_CONV)



  if (loading) return <Loading />
  if (error) return <h1 className="text-lg text-center pt-4 text-gray-500">Something went wrong :( </h1>


  const list: any[] = data.getConversationHistory.conversations
  return (
    <div id="scrollableConv" style={{ height: "100vh", overflow: "auto" }}>
      <InfiniteScroll
        dataLength={list?.length || 0}
        next={() => {
          props.setPage(Math.floor((list?.length || 20) / 20) + 1);
          return fetchMore({
            variables: {
              page: Math.floor((list?.length || 20) / 20) + 1,

            },
          });
        }}
        hasMore={data?.getConversationHistory?.totalCount > list?.length || false}
        loader={<Loading />}
        scrollableTarget="scrollableConv"
        style={{
          overflow: "hidden"
        }}
        className="mb-48"
      >
        {
          list.map((person) => {
            if (!unique.includes(person.with.id)) {
              unique.push(person.with.id)
              return (
                <ChatItem
                  key={person.with.id}
                  id={person.with.id}
                  name={person.with.name}
                  username={person.with.userName}
                  imageURL={person.with.imageURL}
                  numberOfUnseen={person.unseenMessageCount}
                  lastMessage={person.lastMessage.message}
                  createdAt={person.lastMessage.createdAt}
                />
              )
            }

          })}
      </InfiniteScroll>
    </div>


  )
}
export default ChatConv;
