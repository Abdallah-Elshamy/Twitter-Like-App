
import { useQuery } from '@apollo/client';
import React, { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../../../UI/Loading';
import { parseJwt } from "../../../common/utils/jwtDecoder"
import ChatItem, { ChatItemEntity } from './PersonItem/ChatItem';
import { GET_CHAT_CONV } from '../../../common/queries/GET_CHAT_CONV';
import { chatUserVar } from '../../../common/cache';
import { Active_Chat_User } from '../../../common/queries/Active_Chat_User';

interface PersonListProps {
  page: number;
  setPage: any;
}

const ChatConv: React.FC<PersonListProps> = (props) => {

  let loggedUser: any;
  if (localStorage.getItem("token")) {
    loggedUser = parseJwt(localStorage?.getItem("token")!)
  }


  let { data, loading, error, fetchMore } = useQuery(GET_CHAT_CONV)

  useEffect(() => {
    console.log("from useEffect")
    return chatUserVar({
      id: list[0].with.id,
      name: list[0].with.name,
      username: list[0].with.username,
      imgURL: list[0].with.imageURL
    })

  }, [])

  console.log(data)
  if (!loading && data && data?.getConversationHistory?.conversations?.length === 10
    && data?.getConversationHistory?.totalCount > 10) {
    fetchMore({
      variables: {
        page: 2,
      },
    })
  }
  if (loading) return <Loading />
  if (error) return <h1 className="text-lg text-center pt-4 text-gray-500">Something went wrong :( </h1>


  const list: any[] = data.getConversationHistory.conversations

  return (
    <InfiniteScroll
      dataLength={list?.length || 0}
      next={() => {
        props.setPage(Math.floor((list?.length || 10) / 10) + 1);
        return fetchMore({
          variables: {
            page: Math.floor((list?.length || 10) / 10) + 1,

          },
        });
      }}
      hasMore={data?.getConversationHistory?.totalCount > list?.length || false}
      loader={<Loading />}

      className="pb-20"
    >
      {

        list.map((person, i) => {
          return (
            <ChatItem
              key={person.with.id + i}
              id={person.with.id}
              name={person.with.name}
              username={person.with.userName}
              imageURL={person.with.imageURL}
              numberOfUnseen={person.unseenMessageCount}
              lastMessage={person.lastMessage.message}
              createdAt={person.lastMessage.createdAt}
            />
          );
        })}
    </InfiniteScroll>

  )
}
export default ChatConv;
