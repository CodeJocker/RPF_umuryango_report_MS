import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../utils/Axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const userToken = localStorage.getItem("user");
  const navigate = useNavigate();

  if (!userEmail || !userToken) {
    console.log("Unauthorized access. Please log in.");
    navigate("/login");
  }

  const handleLogout = async (email, token) => {
    // const email = localStorage.getItem("userEmail");
    // const token = localStorage.getItem("user");
    if (!email || !token) {
      console.log("Unauthorized access. Please log in.");
      navigate("/login");
      return;
    }
    try {
      const res = await api.post("/auth/v1/logout", { email, token });
      if (res.status === 200) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("user");
        toast.success("Logout successful!");

        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="logo group cursor-pointer">
              <h1 className="text-white text-2xl font-bold font-sans tracking-tight transition-all duration-300 group-hover:scale-105">
                Umuryango
                <span className="text-orange-500 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent font-extrabold">
                  RPF
                </span>
              </h1>
            </Link>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/category"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Categories
            </Link>
            <Link
              to="/members"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Members
            </Link>
            <Link
              to="/payment-report/"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Make Payment
            </Link>
          </div>

          {/* Login/CTA Section */}
          <div className="flex items-center space-x-4">
            {userEmail ? (
              <button
                onClick={() => {
                  const email = localStorage.getItem("userEmail");
                  const token = localStorage.getItem("user");

                  if (!email || !token) return;

                  handleLogout(email.trim(), token.trim());
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                  Login
                </button>
              </Link>
            )}
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 py-5">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/50 backdrop-blur-sm rounded">
              <Link
                to="/"
                className="block px-3 py-2 text-slate-300 hover:text-white bg-slate-400/8 hover:bg-slate-700/50 rounded-md transition-all duration-200"
              >
                Home
              </Link>
              <Link
                to="/category/"
                className="block px-3 py-2 text-slate-300 hover:text-white bg-slate-400/8 hover:bg-slate-700/50 rounded-md transition-all duration-200"
              >
                Categories
              </Link>
              <Link
                to="/members/"
                className="block px-3 py-2 text-slate-300 hover:text-white bg-slate-400/8 hover:bg-slate-700/50 rounded-md transition-all duration-200"
              >
                Members
              </Link>
              <Link
                to="/payment-report/"
                className="block px-3 py-2 text-slate-300 hover:text-white bg-slate-400/8 hover:bg-slate-700/50 rounded-md transition-all duration-200"
              >
              Payment Report
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
