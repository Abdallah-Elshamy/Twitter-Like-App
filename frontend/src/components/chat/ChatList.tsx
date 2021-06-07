import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { ChannelList, Chat } from 'stream-chat-react';
import { Get_SearchBar_Value } from '../../common/queries/Get_SearchBar_Value';
import SearchResult from '../SerachResult';
import ChatConv from '../TrendsBar/ListOfUsers/ChatConv';
import PersonList from '../TrendsBar/ListOfUsers/PersonList';
import SearchBar from '../TrendsBar/SearchBar/SearchBar';

export const ChatList: React.FC = () => {
    const search = useQuery(Get_SearchBar_Value)
    const searchQ: string = search.data.searchBarValue.value

    const [page, setPage] = useState(1)
    const [conPage, setConPage] = useState(1)


    return <div className="w-full h-full">
        <div className="top-bar p-4" >
            <SearchBar />

        </div>
        {searchQ !== "" ?
            <div className="w-full h-full ">
                <p>Working</p>
                <PersonList page={page} queryName="Get_Search_Result" searchQ={searchQ} setPage={setPage} fromChat={true} ></PersonList>
            </div>
            :
            <div>
                <h1>CHAT LIST</h1>
                <ChatConv setPage={setConPage} page={page}></ChatConv>
            </div>
        }
    </div>

}





