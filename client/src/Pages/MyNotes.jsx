import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

const MyNotes = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const { currentUser } = useSelector((state) => state.userSlice);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/notes/getallnotes/${currentUser._id}`)
      .then((res) => setData(res.data.notes))
      .catch((err) => setError(err.response.data.message));
  }, []);

  const deleteHandler = (id, title) => {
    axios
      .delete(`http://localhost:8000/api/notes/delete/${id}`)
      .then((res) => {
        setDeleteMessage(title + " " + res.data);
        setData((prevData) => prevData.filter((note) => note._id !== id));
      })
      .catch((err) => setError(err.response.data.message));
  };

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500 h-screen flex justify-center">
      <div className="bg-white bg-opacity-30 p-8 rounded-lg shadow-md w-1/2 m-5">
        <h1 className="text-4xl font-bold mb-6">My Notes</h1>
        {error && <p>{error}</p>}
        {data.length > 0 ? (
          <React.Fragment>
            {deleteMessage && <p>{deleteMessage}</p>}
            {data.map((note) => (
              <div
                key={note._id}
                className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
                  <p className="text-gray-600">{note.description}</p>
                  {note.image.length > 0 && (
                    <div className="mt-4 flex gap-5 flex-wrap">
                      {note.image.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`${index + 1}`}
                          className="w-20 h-20 rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-5">
                  <Link to={`/updatenotes/${note._id}`}>
                    <button className="bg-green-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-green-600 mt-2 ps-7 pe-7">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteHandler(note._id, note.title)}
                    className="bg-red-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-red-800 mt-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </React.Fragment>
        ) : (
          <p>No notes available.</p>
        )}
      </div>
    </div>
  );
};

export default MyNotes;
