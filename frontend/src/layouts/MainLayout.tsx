import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <nav>
                <Link to={"/"}>IPs</Link>
            </nav>
            <Outlet />
        </>
    )
}

export default MainLayout;