import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "../dashboard/Sidebar";
import MyProfile from "../dashboard/MyProfile";
import MyBlogs from "../dashboard/MyBlogs";
import CreateBlog from "../dashboard/CreateBlog";
import UpdateBlog from "../dashboard/UpdateBlog";
import { Navigate } from "react-router-dom";
function Dashboard() {
  const { profile, isAuthenticated } = useAuth();
  const [component, setComponent] = useState("My Blogs");
  const [showSidebar, setShowSidebar] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        component={component}
        setComponent={setComponent}
        show={showSidebar}
        setShow={setShowSidebar}
      />

      <div className={`${showSidebar ? "ml-64" : "ml-0"} transition-all duration-300`}>
        {component === "My Profile" ? (
          <MyProfile />
        ) : component === "Create Blog" ? (
          <CreateBlog />
        ) : component === "Update Blog" ? (
          <UpdateBlog />
        ) : (
          <MyBlogs />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
