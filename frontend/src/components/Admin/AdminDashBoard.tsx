import AdminWall from "./AdminWall";
import { SideBar } from "../sideBar/sideBar";
import TrendsBar from "../TrendsBar/TrendsBar";
import "../../App.css";
import "../profile/profile.css";
import "../../styles/layout.css";

function AdminDashBoard() {
    return (
        <main className="main-container">
            <aside className="sb-left">
                <SideBar />
            </aside>
            <article className="wall">
                <AdminWall />
            </article>
            <aside className="sb-right">
                <TrendsBar />
            </aside>
        </main>
    );
}
export default AdminDashBoard;
