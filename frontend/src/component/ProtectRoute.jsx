import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";


const ProtectRoute = () => {

    const {isLoggedin,loading} = useContext(AppContext);
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h2>Loading...</h2>
            </div>
        );
    }


    if (!isLoggedin) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectRoute;