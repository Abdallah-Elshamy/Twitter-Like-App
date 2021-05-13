import AdminWall from "./AdminWall"
import { SideBar } from "../sideBar/sideBar";
import TrendsBar from '../TrendsBar/TrendsBar';
import '../../App.css';
import '../profile/profile.css';
import '../../styles/layout.css'



function AdminDashBoard(){
    return (
        <main className="main-container">
        <aside className="sb-left">< SideBar /></aside>
        <article className="wall">
            <AdminWall />
          </article>
        <aside className="sb-right">< TrendsBar /></aside>

      </main>
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