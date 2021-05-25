
import { useQuery } from '@apollo/client';
import React, { Fragment, useState } from 'react';
import { Get_SearchBar_Value } from '../common/queries/Get_SearchBar_Value';
import { Get_Search_Result } from '../common/queries/Get_Search_Result';
import { PersonEntity } from '../common/TypesAndInterfaces';
import ListOfUsers from './TrendsBar/ListOfUsers/listofusers';
import InfiniteScroll from "react-infinite-scroll-component";
import PersonItem from "./TrendsBar/ListOfUsers/PersonItem/PersonItem";
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

  const [page, setPage] = useState<any>(1)
  const { data, loading, error, fetchMore} = useQuery(Get_Search_Result, { variables: { name: searchQ } })
  if (searchQ === "") {
    return <h1 className="text-lg text-center pt-4">Try searching for people, names, usernames
</h1>
  }
  if(!loading && data && data?.users?.users?.length === 10 && data?.users?.totalCount > 10){
    fetchMore({
        variables: {
            page: 2,
            name: searchQ,
        },
    })
}
  if (loading) return <Loading />
  if (error) return <h1 className="text-lg text-center pt-4 text-gray-500">Something went wrong :( </h1>

  const list: PersonEntity[] = data.users.users
  if (list.length === 0)
        return <h1 className="text-lg text-center pt-4">No Results</h1>;
  return (
    <InfiniteScroll
            dataLength={list?.length || 0}
            next={() => {
                setPage(Math.floor((list?.length || 10)/10) + 1);
                return fetchMore({
                    variables: {
                        page: Math.floor((list?.length || 10)/10) + 1,
                        name: searchQ,
                    },
                });
            }}
            hasMore={data?.users?.totalCount >= page * 10 || false}
            loader={<Loading />}
        >
            {list.map((person) => {
                return (
                    <PersonItem
                        key={person.username}
                        id={person.id}
                        name={person.name}
                        username={person.username}
                        followed={person.followed}
                        imageURI={person.imageURI}
                        isFollowing={person.isFollowing}
                        bio={person.bio}
                    />
                );
            })}
        </InfiniteScroll>

  )
}
export default SearchResult;
