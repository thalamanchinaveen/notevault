import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  deleteUserDetailsFail,
  deleteUserDetailsStart,
  deleteUserDetailsSuccess,
  getUserDetailsFail,
  getUserDetailsStart,
  getUserDetailsSuccess,
  updateUserDetailsFail,
  updateUserDetailsStart,
  updateUserDetailsSuccess,
} from "../Redux/user/userSlice";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { persistor } from "../Redux/store";
import { Link } from "react-router-dom";
import LogoutButton from "../Components/LogoutButton";

axios.defaults.withCredentials = true;

const ProfilePage = () => {
  const inputRef = useRef();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userData, setUserData] = useState({});

  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector(
    (state) => state.userSlice
  );

  const getUserDetails = async () => {
    try {
      dispatch(getUserDetailsStart());
      const res = await axios.get(
        `http://localhost:8000/api/user/get/${currentUser._id}`,
        { withCredentials: true }
      );
      setUserData(res?.data);
      dispatch(getUserDetailsSuccess());
    } catch (err) {
      dispatch(getUserDetailsFail(err?.response?.data?.message));
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      avatar: userData.avatar || "",
      username: userData.username || "",
      email: userData.email || "",
      password: "",
    }));
  }, [userData]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          formik.setValues({ ...formik.values, avatar: downloadURL })
        );
      }
    );
  };

  const initialValues = {
    avatar: "",
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      updateUserDetailsStart();
      const res = await axios.post(
        `http://localhost:8000/api/user/update/${currentUser._id}`,
        values,
        { withCredentials: true }
      );
      setUserData(res.data)
      dispatch(updateUserDetailsSuccess(res.data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserDetailsFail(err.response.data.message));
      setUpdateSuccess(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const deleteHandler = async () => {
    try {
      dispatch(deleteUserDetailsStart());
      await axios.delete(
        `http://localhost:8000/api/user/delete/${currentUser._id}`
      );
      dispatch(deleteUserDetailsSuccess());
      persistor.purge();
    } catch (err) {
      dispatch(deleteUserDetailsFail(err.response.data.message));
    }
  };

  return (
    <div>
      {userData._id ? (
        <div className="bg-gradient-to-br from-teal-700 to-teal-500 min-h-screen flex justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-14 mb-10 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-teal-500 uppercase text-center">
              Profile
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4 flex flex-col items-center">
                <input
                  type="file"
                  name="image"
                  id="image"
                  hidden
                  ref={inputRef}
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {formik.values.avatar && (
                  <img
                    src={formik.values.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mb-4"
                    onClick={() => inputRef.current.click()}
                  />
                )}
                <p className="text-sm self-center">
                  {fileUploadError ? (
                    <span className="text-red-700">
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className="text-green-700">
                      Image successfully uploaded!
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className={`w-full px-4 py-2 border-b-2 focus:outline-none ${
                    formik.touched.username && formik.errors.username
                      ? "border-red-500"
                      : "border-teal-500"
                  }`}
                  placeholder="Username"
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.username}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full px-4 py-2 border-b-2 focus:outline-none ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-teal-500"
                  }`}
                  placeholder="Email"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  autoComplete="current-password"
                  className={`w-full px-4 py-2 border-b-2 focus:outline-none ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-teal-500"
                  }`}
                  placeholder="Password"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>
              <button
                disabled={loading}
                type="submit"
                className="bg-teal-400 text-white px-4 py-2 rounded-full w-full focus:outline-none hover:bg-teal-800 mt-2 disabled:bg-opacity-5"
              >
                {loading ? "Loading..." : "Update Profile"}
              </button>
            </form>
            <Link to="/createnotes">
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-full w-full focus:outline-none hover:bg-yellow-600 mt-2 disbled:opacity-80">
                Create Notes
              </button>
            </Link>
            <p className="text-red-700 mt-5">{error ? error : ""}</p>
            <p className="text-green-700 mt-5">
              {updateSuccess ? "User is updated successfully!" : ""}
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={deleteHandler}
                type="submit"
                className="bg-red-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-red-800 mt-2"
              >
                Delete
              </button>
              <LogoutButton
                className={
                  "bg-green-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-green-600 mt-2"
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-4xl text-red-700 text-center">{error}</h1>
      )}
    </div>
  );
};

export default ProfilePage;
