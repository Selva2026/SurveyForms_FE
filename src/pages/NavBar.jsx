import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username"); // optional

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="w-full bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">

      
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={()=>{ token?navigate("/dashboard"):navigate("/")}}
      >
        Survey Forms
      </h1>

      
      <div className="flex items-center gap-6 text-sm font-semibold">

        {token ? (
          <>
           <h1>Welcome</h1> 
            <span className="text-white">
              👤 {userName || "User"}
            </span>

            <Link
              to="/dashboard"
              className="hover:text-yellow-300"
            >
              Dashboard
            </Link>

            <Link
              to="/create"
              className="hover:text-yellow-300"
            >
              Create Survey
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="hover:text-yellow-300"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hover:text-yellow-300"
            >
              Register
            </Link>
          </>
        )}
      </div>
      
    </nav>
    

  );
};

export default NavBar;
