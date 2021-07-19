import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Get_SearchBar_Value } from '../../common/queries/Get_SearchBar_Value';
import ChatConv from '../TrendsBar/ListOfUsers/ChatConv';
import PersonList from '../TrendsBar/ListOfUsers/PersonList';
import SearchBar from '../TrendsBar/SearchBar/SearchBar';

export const ChatList: React.FC = () => {
    const search = useQuery(Get_SearchBar_Value)
    const searchQ: string = search.data.searchBarValue.value

    const [page, setPage] = useState(1)
    const [conPage, setConPage] = useState(1)


    return <div className="w-full">
        <div className="top-bar p-4" >
            <SearchBar />

        </div>
        {searchQ !== "" ?
            <div className="w-full h-full ">
                <PersonList page={page} queryName="Get_Search_Result" searchQ={searchQ} setPage={setPage} fromChat={true} ></PersonList>
            </div>
            :
            <div className="w-full h-full">
                <ChatConv setPage={setConPage} page={page}></ChatConv>
            </div>
        }
    </div>

}





