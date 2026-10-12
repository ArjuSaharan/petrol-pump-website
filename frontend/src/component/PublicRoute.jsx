import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";


const PublicRoute = () => {
    const { isLoggedin,loading} = useContext(AppContext);
    if (loading) {

        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }
    if (isLoggedin) {

        return <Navigate to="/user" replace />;
    }
    return <Outlet />;
};
export default PublicRoute;