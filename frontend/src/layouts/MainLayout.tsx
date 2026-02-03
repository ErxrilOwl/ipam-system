import { Outlet } from "react-router-dom";
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';
import { useAuth } from "@/auth/AuthContext";

const MainLayout: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <>
            <div className="flex w-full min-h-screen">
                <div className="page-wrapper flex w-full ">
                {/* Header/sidebar */}
                <div className="xl:block hidden">
                    <Sidebar userRole={ user?.role ?? "" } />
                </div>
                <div className="body-wrapper w-full bg-white dark:bg-dark">
                    {/* Top Header  */}
                    <Header />

                    {/* Body Content  */}
                    <div className={'container mx-auto px-6 py-30'}>
                        <main className="grow">
                            <Outlet />
                        </main>
                    </div>
                </div>
                </div>
            </div>
            </>
    )
}

export default MainLayout;