import { NavLink, useRouteMatch, Switch, Route } from "react-router-dom";
import "../../App.css";
import "../profile/profile.css";
import "../../styles/layout.css";
import React, { Fragment, useState } from "react";
import TweetList from "../tweets/TweetList"

function AdminWall() {
    const match = useRouteMatch();
    const [reportedTweetsPage, setReportedTweetsPage] = useState<any>(1);
    const [NSFWTweetsPage, setNSFWTweetsPage] = useState<any>(1);
    const [reportedUsersPage, setReportedUsersPage] = useState<any>(1);

    return (
        <Fragment>
            <h1 className="text-7xl text-center italic text-gray-400 font-thin m-10">
                Admin Board
            </h1>
            <nav>
                <ul className="pf--nav-ul ">
                    <NavLink
                        exact
                        activeClassName="active"
                        className="pf--nav-link"
                        to={match.url}
                    >
                        <li>Reported Users</li>
                    </NavLink>
                    <NavLink
                        activeClassName="active"
                        className="pf--nav-link"
                        to={match.url + "/reported-tweets"}
                    >
                        <li>Reported Tweets</li>
                    </NavLink>

                    <NavLink
                        activeClassName="active"
                        className="pf--nav-link"
                        to={match.url + "/nsf-tweets"}
                    >
                        <li>NSFW Tweets</li>
                    </NavLink>
                </ul>
            </nav>
            <div className="tweets">
                <Switch>
                    <Route
                        exact
                        path={match.url}
                        render={() => (
                            <TweetList
                                page={reportedTweetsPage}
                                setPage={setReportedTweetsPage}
                                isAdminBoard={true}
                            />
                        )}
                    />
                   <Route
                        exact
                        path={match.url + "/reported-tweets"}
                        render={() => (
                            <TweetList
                                page={reportedTweetsPage}
                                setPage={setReportedTweetsPage}
                                isAdminBoard={true}
                            />
                        )}
                    />
                    {/* <Route
                        exact
                        path={match.url + "/media"}
                        render={() => (
                            <TweetList
                                filter={`media`}
                                page={mediaPage}
                                setPage={setMediaPage}
                                id={ID}
                            />
                        )}
                    /> */}
                </Switch>
            </div>
        </Fragment>
    );
}
export default AdminWall;
