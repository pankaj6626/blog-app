import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { BACKEND_URL } from "../../utils";

function Register() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();

  const navigateTo = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhoto(file);
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("education", education);
    formData.append("photo", photo);

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data.message || "User registered successfully");
      localStorage.setItem("jwt", data.token);
      setProfile(data);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Please fill the required fields"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-800 px-4 py-10">
      <div className="absolute left-[-80px] top-[-40px] h-60 w-60 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="absolute bottom-[-40px] right-[-20px] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:grid-cols-[1.1fr_1.3fr]">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-10 text-white lg:flex">
            <div>
              <div className="mb-10 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">
                Create account
              </div>
              <h1 className="text-4xl font-black leading-tight">
                Start writing.
                <br />
                Start impacting.
              </h1>
            </div>

            <div className="space-y-4 text-indigo-50/90">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.25em] text-indigo-100">
                  Why join?
                </p>
                <p className="mt-2 text-lg font-medium">
                  Publish stories, connect with readers, and grow your audience.
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
                Create your account and join our community.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 focus:border-blue-400 focus:bg-white/10"
                  >
                    <option value="" className="text-slate-900">Select Role</option>
                    <option value="user" className="text-slate-900">User</option>
                    <option value="admin" className="text-slate-900">Admin</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/10"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
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

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Phone number
                  </label>
                  <input
                    type="number"
                    placeholder="Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/10"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/10"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Education
                  </label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-200 focus:border-blue-400 focus:bg-white/10"
                  >
                    <option value="" className="text-slate-900">Select Your Education</option>
                    <option value="BCA" className="text-slate-900">BCA</option>
                    <option value="MCA" className="text-slate-900">MCA</option>
                    <option value="MBA" className="text-slate-900">MBA</option>
                    <option value="BBA" className="text-slate-900">BBA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Profile photo
                </label>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-slate-800">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        Add
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={changePhotoHandler}
                    className="w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/40"
              >
                <span className="inline-flex items-center gap-2">
                  Create account
                  <span aria-hidden="true">→</span>
                </span>
              </button>

              <div className="pt-2 text-center text-sm text-slate-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

