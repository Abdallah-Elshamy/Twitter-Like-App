
import { useQuery } from '@apollo/client';
import React, { Fragment } from 'react';
import { Get_SearchBar_Value } from '../common/queries/Get_SearchBar_Value';
import { Get_Search_Result } from '../common/queries/Get_Search_Result';
import { PersonEntity } from '../common/TypesAndInterfaces';
import ListOfUsers from './TrendsBar/ListOfUsers/listofusers';
import { useLocation } from 'react-router';
import Loading from '../UI/Loading';



const SearchResult: React.FC = () => {

  //static behaviour
  /*
  const location = useLocation()
  const searchQ = location.search.substr(6)
*/


  //dynamic behaviour
  const search = useQuery(Get_SearchBar_Value)
  const searchQ: string = search.data.searchBarValue.value


  const { data, loading, error } = useQuery(Get_Search_Result, { variables: { name: searchQ } })
  if (searchQ === "") {
    return <h1 className="text-lg text-center pt-4">Try searching for people, names, usernames
</h1>
  }
  if (loading) return <Loading />
  if (error) return <h1 className="text-lg text-center pt-4 text-gray-500">Something went wrong :( </h1>

  const resultList: PersonEntity[] = data.users.users
  return (
    <Fragment>
      <ListOfUsers list={resultList} />
    </Fragment>

  )
}
export default SearchResult;
