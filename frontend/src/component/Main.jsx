import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../userspage/UserNavbar";
import UserDashboard from "../userspage/UserDashboard";

const Main = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <UserNavbar />
      <UserDashboard/>
      {/* Right Side Content */}
      <main className="ml-64 pt-[75px] min-h-screen">
    <div className="p-6">
        <Outlet />
    </div>
</main>

    </div>
  );
};

export default Main;