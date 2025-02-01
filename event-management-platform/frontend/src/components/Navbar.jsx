import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user is authenticated

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    navigate("/login"); // Redirect to the login page
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle mobile menu
  };
  return (
    <nav className="bg-blue-500 p-4 text-white border-b-4 border-blue-900 flex justify-between items-center">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Event Manager
        </Link>
        <div className="hidden md:flex space-x-4 justify-center items-center font-semibold">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-black hover:bg-blue-200 border-2 border-red-500 bg-red-500 px-3 py-1 rounded-lg font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:text-blue-200">
                Register
              </Link>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
      </div>
      {isOpen && (
          <div className="md:hidden bg-blue-700 mt-2 py-4 rounded-2xl absolute top-10 right-0">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-blue-600 transition duration-300"
              onClick={toggleMenu}
            >
               Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-blue-600 transition duration-300"
                  onClick={toggleMenu}
                >
                   Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-600 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="block px-4 py-2 hover:bg-blue-600 transition duration-300"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-blue-600 transition duration-300"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
    </nav>
  );
};

export default Navbar;