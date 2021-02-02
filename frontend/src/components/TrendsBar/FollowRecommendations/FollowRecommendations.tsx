import React from 'react';
import { PersonEntity } from '../../../common/TypesAndInterfaces';
import SideList from '../../../UI/SideList/SideList';
import PersonItem from './PersonItem/PersonItem';
type Props = {
  followRec: PersonEntity[]
}
const FollowRecommendations: React.FC<Props> = ({followRec}) => {

  const followList = followRec.map(person => {
    return (
      <PersonItem key={person.username} 
      name = {person.name} 
      username = {person.username} 
      followed={person.followed} 
      imageURI = {person.imageURI}
      />
    )
  })


  return (
   <SideList title="Who to follow " redirect="/" >
        {followList}
      </SideList>
  )
}
export default FollowRecommendations;
