
import { useQuery } from '@apollo/client';
import React, { Fragment } from 'react';
import { Get_SearchBar_Value } from '../common/queries/Get_SearchBar_Value';
import { Get_Search_Result } from '../common/queries/Get_Search_Result';
import ListOfUsers from './TrendsBar/ListOfUsers/listofusers';




const SearchResult: React.FC = () => {
  let searchQ = useQuery(Get_SearchBar_Value)
  searchQ = searchQ.data.searchBarValue.value
  console.log(searchQ)
  const { data, loading, error } = useQuery(Get_Search_Result, { variables: { name: searchQ } })
  if (loading) return <h1 className="text-lg text-center">Loading...</h1>

  if (error) return <h1 className="text-lg text-center bg-red-700">ERROR</h1>



  return (
    <Fragment>
      <ListOfUsers list={data.users.users} />

    </Fragment>

  )
}
export default SearchResult;
