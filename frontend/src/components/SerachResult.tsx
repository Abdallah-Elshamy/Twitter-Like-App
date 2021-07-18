
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Get_SearchBar_Value } from '../common/queries/Get_SearchBar_Value';
import PersonList from "./TrendsBar/ListOfUsers/PersonList"

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
