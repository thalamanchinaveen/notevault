import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useSelector((state) => state.userSlice);
  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500  min-h-screen flex flex-col items-center pt-40">
      <h1 className="text-4xl font-bold text-white mb-8">
        Welcome to <span className="text-yellow-400">Note</span>
        <span className="text-white">Vault</span>
      </h1>
      {currentUser ? (
        <div className="flex flex-col gap-8 items-center">
          <div>
            <span className="text-yellow-400 text-4xl font-extrabold uppercase ">
              {currentUser.username}
            </span>
          </div>
          <div className="flex gap-6">
            <Link to="/createnotes">
              <button className="bg-green-400 font-bold text-white px-4 py-2 rounded-full mt-2 hover:bg-green-600">
                Create Notes
              </button>
            </Link>
            <Link to="/mynotes">
              <button className="bg-red-400 font-bold text-white px-4 py-2 rounded-full mt-2 hover:bg-red-800 ">
                My Notes
              </button>
            </Link>
            <Link to="/profile">
              <button className="bg-yellow-400 font-bold text-white px-4 py-2 rounded-full mt-2 hover:bg-yellow-800">
                Profile
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login">
            <button className=" bg-green-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-green-600 mt-2">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-red-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-red-800 mt-2">
              Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
