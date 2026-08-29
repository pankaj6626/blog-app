import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CiMenuBurger } from "react-icons/ci";
import { BiSolidLeftArrowAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils";

function Sidebar({ setComponent, show, setShow }) {
  const { profile } = useAuth();
  const { setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();

  const handleComponents = (value) => {
    setShow(false);
    setComponent(value);
  };
  const gotoHome = () => {
    navigateTo("/");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/users/logout`,
        { withCredentials: true }
      );
       toast.success(data.message);
       localStorage.removeItem("jwt"); // deleting token in localStorage so that if user logged out it will goes to login page
       setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      //console.log(error);
      //toast.error(error.data.message || "Failed to logout");
      const errorMessage =
      error.response?.data?.message || "Failed to logout. Please try again.";
    toast.error(errorMessage); // Display error toast
    console.error("Logout Error:", error); // Log detailed error
    }
  };

  return (
    <>
      {!show && (
        <button
          onClick={() => setShow(true)}
          className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          <CiMenuBurger className="text-xl" />
          Menu
        </button>
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 bg-gray-50 shadow-lg transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="text-xl font-bold text-gray-800">Menu</div>
          <button
            onClick={() => setShow(false)}
            className="rounded-full p-2 text-gray-700 hover:bg-gray-200"
            aria-label="Hide sidebar"
          >
            <BiSolidLeftArrowAlt className="text-2xl" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <img
            className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
            src={profile?.user?.photo?.url || profile?.photo?.url}
            alt="user avatar"
          />
          <p className="text-lg font-semibold text-gray-800">
            {profile?.user?.name || profile?.name}
          </p>
        </div>

        <ul className="mt-8 space-y-4 px-4">
          <button
            onClick={() => handleComponents("My Blogs")}
            className="w-full px-4 py-2 bg-green-500 rounded-lg hover:bg-green-700 transition duration-300"
          >
            MY BLOGS
          </button>
          <button
            onClick={() => handleComponents("Create Blog")}
            className="w-full px-4 py-2 bg-blue-400 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            CREATE BLOG
          </button>
          <button
            onClick={() => handleComponents("My Profile")}
            className="w-full px-4 py-2 bg-pink-500 rounded-lg hover:bg-pink-700 transition duration-300"
          >
            MY PROFILE
          </button>
          <button
            onClick={gotoHome}
            className="w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-700 transition duration-300"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-700 transition duration-300"
          >
            LOGOUT
          </button>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;