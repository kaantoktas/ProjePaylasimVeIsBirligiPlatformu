import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateAvatarUrl } from "../utils/avatarUtils";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate("/auth");
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  const handleEditProfileClick = () => {
    navigate(`/profile/${user.username}`);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-purple-500/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 animate-pulse-slow">
            PROJE ZİNCİRİ
          </span>
        </Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={handleDropdownToggle}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={generateAvatarUrl(user.name, user.surname)}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full border-2 border-white/50"
                />
                <span className="text-white font-semibold hidden md:block">
                  {user.username}
                </span>
              </div>
              {isDropdownOpen && (
                <div className="absolute top-14 right-0 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-down border border-purple-500/30">
                  <div className="p-4 border-b border-gray-700">
                    <span className="block text-sm font-semibold text-gray-200">
                      Hoş geldin, {user.name || ""}!
                    </span>
                    <span className="block text-xs text-gray-400">
                      @{user.username}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleEditProfileClick}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                      >
                        <FaUserCircle className="text-lg" />
                        <span>Profilim</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span>Çıkış Yap</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Giriş Yap
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
