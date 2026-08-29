import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { BACKEND_URL } from "../../utils";

function Login() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();

  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        { email, password, role },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      // Store the token in localStorage
      localStorage.setItem("jwt", data.token); // storing token in localStorage so that if user refreshed the page it will not redirect again in login
      toast.success(data.message || "User Logined successfully", {
        duration: 3000,
      });
      setProfile(data.user || data);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      setRole("");
      navigateTo("/");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Please fill the required fields",
        {
          duration: 3000,
        }
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-700 px-4 py-10">
      <div className="absolute left-[-80px] top-[-60px] h-52 w-52 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="absolute bottom-[-60px] right-[-30px] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-10 text-white lg:flex">
            <div>
              <div className="mb-10 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">
                Welcome back
              </div>
              <h1 className="text-4xl font-black leading-tight">
                Share ideas.
                <br />
                Build your voice.
              </h1>
            </div>

            <div className="space-y-4 text-blue-50/90">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
                  Daily inspiration
                </p>
                <p className="mt-2 text-lg font-medium">
                  Discover stories, creators, and meaningful content every day.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-6 sm:p-8 lg:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-white">
                Cilli<span className="text-blue-400">Blog</span>
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Sign in to continue your journey.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/10"
                >
                  <option value="" className="text-slate-900">Select Role</option>
                  <option value="user" className="text-slate-900">User</option>
                  <option value="admin" className="text-slate-900">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/10"
                />
              </div>

              <button
                type="submit"
                className="group w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/40"
              >
                <span className="inline-flex items-center gap-2">
                  Login now
                  <span aria-hidden="true">→</span>
                </span>
              </button>

              <div className="pt-2 text-center text-sm text-slate-300">
                New here?{" "}
                <Link
                  to={"/register"}
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

