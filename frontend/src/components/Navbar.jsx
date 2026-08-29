import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { BsSun, BsMoon } from "react-icons/bs"; // Icons for light/dark mode
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils";

function Navbar({ darkMode, setDarkMode }) {
  const [show, setShow] = useState(false);

  const { profile, isAuthenticated, setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();
  const currentUser = profile?.user || profile;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(`${BACKEND_URL}/api/users/logout`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      localStorage.removeItem("jwt");
      toast.success(data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };
  
        
  return (
    <>
      <nav className="shadow-lg px-4 py-2 dark:bg-gray-900 dark:text-white">
        <div className="flex items-center justify-between container mx-auto">
          {/* Logo */}
          <div className="font-semibold text-xl">
            cilli<span className="text-blue-500">Blog</span>
          </div>

          {/* Desktop Navigation */}
          <div className=" mx-6">
            <ul className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-500">
                HOME
              </Link>
              <Link to="/blogs" className="hover:text-blue-500">
                BLOGS
              </Link>
              <Link to="/creators" className="hover:text-blue-500">
                CREATORS
              </Link>
              <Link to="/about" className="hover:text-blue-500">
                ABOUT
              </Link>
              <Link to="/contact" className="hover:text-blue-500">
                CONTACT
              </Link>
            </ul>
            {/* Mobile Menu Toggle */}
            <div className="md:hidden" onClick={() => setShow(!show)}>
              {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Light/Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
            </button>

            {/* Dashboard/Logout */}
            {isAuthenticated && currentUser?.role === "admin" ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded"
              >
                DASHBOARD
              </Link>
            ) : null}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
              >
                LOGIN
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {show && (
          <div className="bg-white dark:bg-gray-900">
            <ul className="flex flex-col h-screen items-center justify-center space-y-3 md:hidden text-xl">
              <Link
                to="/"
                onClick={() => setShow(!show)}
                className="hover:text-blue-500"
              >
                HOME
              </Link>
              <Link
                to="/blogs"
                onClick={() => setShow(!show)}
                className="hover:text-blue-500"
              >
                BLOGS
              </Link>
              <Link
                to="/creators"
                onClick={() => setShow(!show)}
                className="hover:text-blue-500"
              >
                CREATORS
              </Link>
              <Link
                to="/about"
                onClick={() => setShow(!show)}
                className="hover:text-blue-500"
              >
                ABOUT
              </Link>
              <Link
                to="/contact"
                onClick={() => setShow(!show)}
                className="hover:text-blue-500"
              >
                CONTACT
              </Link>
              
              {isAuthenticated && currentUser?.role === "admin" ? (
              <Link
                to="/dashboard"
                className="hover:text-blue-500"
              >
                DASHBOARD
              </Link>
            ) : null}

              <button
                onClick={handleLogout}
                className="hover:text-blue-500"
              >
                LOGOUT
              </button>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
