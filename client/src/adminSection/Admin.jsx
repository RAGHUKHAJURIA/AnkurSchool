import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";


const Admin = () => {
    return (


        <div className="">

            <AdminNavbar />
            
            
            {<Outlet />}



        </div>

    );
};

export default Admin;
