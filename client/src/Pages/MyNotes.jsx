import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SpinnerButton from "../Components/SpinnerButton";
import Popup from "../Components/Popup";
import Message from "../Components/Message";
import api from "../Components/api";

const MyNotes = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [renderNotes, setRenderNotes] = useState(true);
  const [deleteState, setDeleteState] = useState(
    Array(data.length).fill(false)
  );
  const { currentUser } = useSelector((state) => state.userSlice);

  useEffect(() => {
    api
      .get(`/api/notes/getallnotes/${currentUser._id}`)
      .then((res) => {
        setData(res.data.notes);
        setRenderNotes(false);
      })
      .catch((err) => {
        setError(err.response.data.message);
        setRenderNotes(false);
      });
  }, []);

  const deleteHandler = (id, title, index) => {
    const newDeleteStates = [...deleteState];
    newDeleteStates[index] = true;

    setDeleteState(newDeleteStates);
    api
      .delete(`/api/notes/delete/${id}`)
      .then((res) => {
        setDeleteMessage(title + " " + res.data);
        setData((prevData) => prevData.filter((note) => note._id !== id));
        newDeleteStates[index] = false;
        setDeleteState(newDeleteStates);
      })
      .catch((err) => {
        setError(err.response.data.message);
        newDeleteStates[index] = false;
        setDeleteState(newDeleteStates);
      });
  };

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500 h-screen flex justify-center">
      <div className="bg-white bg-opacity-30 p-8 rounded-lg shadow-md w-1/2 m-5">
        <h1 className="text-4xl font-bold mb-6">My Notes</h1>
        {error && <Message message={error} />}
        {data.length > 0 ? (
          <React.Fragment>
            {deleteMessage && <Message message={deleteMessage} />}
            {data.map((note, index) => (
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

                  <SpinnerButton
                    onClick={() => deleteHandler(note._id, note.title, index)}
                    bool={deleteState[index]}
                    className={
                      "bg-red-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-red-800 disabled:bg-opacity-80 mt-2"
                    }
                    initialValue={"Delete"}
                    nextValue={"Deleting..."}
                  />
                </div>
              </div>
            ))}
          </React.Fragment>
        ) : renderNotes ? (
          <Popup text={"Your Notes are Loading"} />
        ) : (
          <Message message={" No notes available."} />
        )}
      </div>
    </div>
  );
};

export default MyNotes;
