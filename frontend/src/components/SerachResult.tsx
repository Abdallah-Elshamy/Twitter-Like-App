
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Get_SearchBar_Value } from '../common/queries/Get_SearchBar_Value';
import { Get_Search_Result } from '../common/queries/Get_Search_Result';
import { PersonEntity } from '../common/TypesAndInterfaces';
import InfiniteScroll from "react-infinite-scroll-component";
import PersonItem from "./TrendsBar/ListOfUsers/PersonItem/PersonItem";
import PersonList from "./TrendsBar/ListOfUsers/PersonList"
import Loading from '../UI/Loading';

const SearchResult: React.FC = () => {
  const search = useQuery(Get_SearchBar_Value)
  const searchQ: string = search.data.searchBarValue.value

  const [page, setPage] = useState<any>(1)
  if (searchQ === "") {
    return <h1 className="text-lg text-center pt-4">Try searching for people, names, usernames</h1>
  }

  return <PersonList page={page} setPage={setPage} queryName="Get_Search_Result" searchQ={searchQ} />
}
export default SearchResult;
