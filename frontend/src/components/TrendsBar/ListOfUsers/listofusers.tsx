import React, { Fragment } from 'react';
import { PersonEntity } from '../../../common/TypesAndInterfaces';
import PersonItem from './PersonItem/PersonItem';
type Props = {
  list: PersonEntity[]
}
const ListOfUsers: React.FC<Props> = ({ list }) => {
  let followList
  if (list.length === 0) { followList = <h1 className="text-lg text-center pt-4">No Results</h1> }
  else followList = list.map(person => {
    return (
      <PersonItem key={person.username}
        name={person.name}
        username={person.username}
        followed={person.followed}
        imageURI={person.imageURI}

      />
    )
  })


  return (
    <Fragment>
      { followList}
    </Fragment>
  )
}
export default ListOfUsers;
