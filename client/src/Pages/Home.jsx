import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useSelector((state) => state.userSlice);

  const guestButtons = [
    {
      to: "/login",
      text: "Login",
      bgColor: "bg-green-400",
      hoverBgColor: "hover:bg-green-600",
    },
    {
      to: "/register",
      text: "Register",
      bgColor: "bg-red-400",
      hoverBgColor: "hover:bg-red-800",
    },
  ];

  const userButtons = [
    {
      to: "/createnotes",
      text: "Create Notes",
      bgColor: "bg-green-400",
      hoverBgColor: "hover:bg-green-600",
    },
    {
      to: "/mynotes",
      text: "My Notes",
      bgColor: "bg-red-400",
      hoverBgColor: "hover:bg-red-800",
    },
    {
      to: "/profile",
      text: "Profile",
      bgColor: "bg-yellow-400",
      hoverBgColor: "hover:bg-yellow-800",
    },
  ];

  const buttons = currentUser ? userButtons : guestButtons;

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500  min-h-screen flex flex-col items-center pt-40">
      <h1 className="text-4xl font-bold text-white mb-8">
        Welcome to <span className="text-yellow-400">Note</span>
        <span className="text-white">Vault</span>
      </h1>

      {currentUser ? (
        <div className="flex flex-col gap-8 items-center">
          <div>
            <span className="text-yellow-400 text-4xl font-extrabold uppercase">
              {currentUser.username}
            </span>
          </div>
          <div className="flex gap-6">
            {buttons.map((button, index) => (
              <Link to={button.to} key={index}>
                <button
                  className={`font-bold text-white px-4 py-2 rounded-full mt-2 ${button.bgColor} ${button.hoverBgColor}`}
                >
                  {button.text}
                </button>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          {buttons.map((button, index) => (
            <Link to={button.to} key={index}>
              <button
                className={`text-white px-4 py-2 rounded-full focus:outline-none mt-2 ${button.bgColor} ${button.hoverBgColor}`}
              >
                {button.text}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;


