import React, { Fragment } from "react";
import { PersonEntity } from "../../../common/TypesAndInterfaces";
import PersonItem from "./PersonItem/PersonItem";
import {parseJwt} from "../../../common/utils/jwtDecoder"

type Props = {
    list: PersonEntity[];
};
const ListOfUsers: React.FC<Props> = ({ list }) => {
    let loggedUser: any;
    if (localStorage.getItem("token")) {
        loggedUser = parseJwt(localStorage?.getItem("token")!)
    }
    if (list.length === 0)
        return <h1 className="text-lg text-center pt-4">No Results</h1>;
    return (
        <Fragment>
            {list.map((person) => {
                return (
                    <PersonItem
                        key={person.userName}
                        id={person.id}
                        name={person.name}
                        userName={person.userName}
                        followed={person.followed}
                        imageURL={person.imageURL}
                        isFollowing={person.isFollowing}
                        bio={"what"}
                        loggedUser={loggedUser}
                        user={person}
                    />
                );
            })}
        </Fragment>
    );
};

// return (
//   <Fragment>
//     { followList}
//   </Fragment>
// )

export default ListOfUsers;
