import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { currentUser } = useSelector((state) => state.userSlice);

  return (
    <header className="bg-gradient-to-br from-teal-500 to-teal-700 p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/">
          <h1 className="font-extrabold text-xl text-white">
            <span className="text-yellow-400">Note</span>
            <span className="text-white">Vault</span>
          </h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/" className="text-white hover:text-yellow-300">
            <li className="hidden sm:inline">Home</li>
          </Link>
          {currentUser && (
            <Link to="/mynotes" className="text-white hover:text-yellow-300">
              <li className="hidden sm:inline">MyNotes</li>
            </Link>
          )}
          {currentUser && (
            <LogoutButton
              className={"text-white hover:text-yellow-300 -mt-1"}
            />
          )}
          <Link to="/profile" className="text-white hover:text-yellow-300">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li>Login</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
