
import { useQuery } from '@apollo/client';
import React, { Fragment, useState } from 'react';
import { Get_Search_Result } from '../../../common/queries/Get_Search_Result';
import { PersonEntity } from '../../../common/TypesAndInterfaces';
import InfiniteScroll from "react-infinite-scroll-component";
import PersonItem from "./PersonItem/PersonItem";
import Loading from '../../../UI/Loading';
import ReportedUsers from "../../../common/queries/reportedUsers"
import { parseJwt } from "../../../common/utils/jwtDecoder"
import ChatItem, { ChatItemEntity } from './PersonItem/ChatItem';

interface PersonListProps {
    queryName: string;
    page: number;
    setPage: any;
    searchQ?: string;
    fromChat?: Boolean
}

const PersonList: React.FC<PersonListProps> = (props) => {
    let loggedUser: any;
    if (localStorage.getItem("token")) {
        loggedUser = parseJwt(localStorage?.getItem("token")!)
    }
    const { page, setPage, searchQ, fromChat } = props
    PersonList.defaultProps = {
        queryName: "Get_Search_Result"
    }
    const queryName: any = {
        Get_Search_Result,
        ReportedUsers,

    }
    let { data, loading, error, fetchMore } = useQuery(queryName[props.queryName], { variables: { name: searchQ } })
    if (data?.reportedUsers) {
        data = { users: data.reportedUsers }
    }
    if (!loading && data && data?.users?.users?.length === 10 && data?.users?.totalCount > 10) {
        fetchMore({
            variables: {
                page: 2,
                name: searchQ,
            },
        })
    }
    if (loading) return <Loading />
    if (error) return <h1 className="text-lg text-center pt-4 text-gray-500">Something went wrong :( </h1>

    if (!fromChat)
        var list: any[] = data.users.users
    else
        list = data.users.users

    console.log("person list", list)
    if (list.length === 0)
        return <h1 className="text-lg text-center pt-4">No Results</h1>;
    return (
        <InfiniteScroll
            dataLength={list?.length || 0}
            next={() => {
                setPage(Math.floor((list?.length || 10) / 10) + 1);
                return fetchMore({
                    variables: {
                        page: Math.floor((list?.length || 10) / 10) + 1,
                        name: searchQ,
                    },
                });
            }}
            hasMore={data?.users?.totalCount > list?.length || false}
            loader={<Loading />}
            style={{
                overflow: "hidden"
            }}
            className="pb-20"
        >
            {list.map((person) => {
                return (
                    !fromChat ?
                        <PersonItem
                            key={person.username}
                            id={person.id}
                            name={person.name}
                            username={person.username}
                            followed={person.followed}
                            imageURI={person.imageURI}
                            isFollowing={person.isFollowing}
                            bio={person.bio}
                            loggedUser={loggedUser}
                            user={person}
                            fromChat={fromChat}
                        /> :
                        <ChatItem
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            username={person.username}
                            imageURL={person.imageURI}
                            lastMessage={person.lastMessage}
                            numberOfUnseen={person.numberOfUnseen}
                        />
                );
            })}
        </InfiniteScroll>

    )
}
export default PersonList;
