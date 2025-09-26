import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { withAdminAuthSimple } from "../hooks/withAdminAuthSimple.jsx";

const Admin = () => {
    return (
        <div className="admin-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <AdminNavbar />
            <div className="page-transition">
                <Outlet />
            </div>
        </div>
    );
};

// Export the component wrapped with admin authentication
export default withAdminAuthSimple(Admin);
