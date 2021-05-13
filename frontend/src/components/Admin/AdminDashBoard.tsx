

function AdminDashBoard(){
    return (
        <h1 className="text-7xl text-center italic text-gray-400 font-thin m-10">Admin Board</h1>
    //   <nav >
    //     <ul className="pf--nav-ul ">
    //       <NavLink exact activeClassName="active" className="pf--nav-link" to={match.url}>
    //         <li>Tweets</li>
    //       </NavLink>
    //       <NavLink activeClassName="active" className="pf--nav-link" to={match.url + '/replies'}>
    //         <li>Tweets & replies</li>
    //       </NavLink>

    //       <NavLink activeClassName="active" className="pf--nav-link" to={match.url + '/media'}>
    //         <li>Media</li>
    //       </NavLink>
    //       <NavLink activeClassName="active" className="pf--nav-link" to={match.url + '/likes'}>
    //         <li>Likes</li>
    //       </NavLink>
    //     </ul>
    //   </nav>
    //   <div className="tweets">
    //     <Switch>
    //       <Route
    //         exact
    //         path={match.url}
    //         render={() => (
    //           <TweetList filter={``} page={tweetsPage} setPage={setTweetsPage} id={ID} />
    //           // to test paganation go to profileWallPage
    //           // <Profilewallpage  filter={``}/>
    //         )}
    //       />
    //       <Route
    //         exact
    //         path={match.url + '/replies'}
    //         render={() => (
    //           <TweetList filter={`replies&tweets`} page={tweetsRepliesPage} setPage={setTweetsRepliesPage} id={ID} />
    //         )}
    //       />
    //       <Route
    //         exact
    //         path={match.url + '/media'}
    //         render={() => (
    //           <TweetList filter={`media`} page={mediaPage} setPage={setMediaPage} id={ID} />
    //         )}
    //       />
    //       <Route
    //         exact
    //         path={match.url + '/likes'}
    //         render={() => (
    //           <TweetList filter={`likes`} page={likesPage} setPage={setLikesPage} id={ID} />
    //         )}
    //       />
    //     </Switch>
    )

}
export default AdminDashBoard