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
import SpinnerButton from "../Components/SpinnerButton";
import Popup from "../Components/Popup";
import Message from "../Components/Message";
import api from "../Components/api";
import InputField from "../Components/InputField";

const ProfilePage = () => {
  const inputFields = [
    { type: "text", id: "username", name: "username", placeholder: "Username" },
    { type: "email", id: "email", name: "email", placeholder: "Email" },
    {
      type: "password",
      id: "password",
      name: "password",
      placeholder: "Password",
    },
  ];

  const inputRef = useRef();
  const { currentUser, error } = useSelector((state) => state.userSlice);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userData, setUserData] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [yesDeleting, setYesDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const deleteHandlerWithConfirmation = () => {
    openDeleteModal();
  };

  const confirmDeleteHandler = async () => {
    await deleteHandler();
    closeDeleteModal();
  };

  const dispatch = useDispatch();

  const getUserDetails = async () => {
    try {
      dispatch(getUserDetailsStart());
      const res = await api.get(`/api/user/get/${currentUser._id}`);
      setUserData(res?.data);
      dispatch(getUserDetailsSuccess());
      setProfileLoading(false);
    } catch (err) {
      dispatch(getUserDetailsFail(err?.response?.data?.message));
      setProfileLoading(false);
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
    setProfileUpdating(true);
    try {
      updateUserDetailsStart();
      const res = await api.post(`/api/user/update/${currentUser._id}`, values);
      setUserData(res.data);
      dispatch(updateUserDetailsSuccess(res.data));
      setUpdateSuccess(true);
      setProfileUpdating(false);
    } catch (err) {
      dispatch(updateUserDetailsFail(err.response.data.message));
      setUpdateSuccess(false);
      setProfileUpdating(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const deleteHandler = async () => {
    setYesDeleting(true);
    try {
      dispatch(deleteUserDetailsStart());
      await api.delete(`/api/user/delete/${currentUser._id}`);
      dispatch(deleteUserDetailsSuccess());
      persistor.purge();
      setYesDeleting(false);
    } catch (err) {
      dispatch(deleteUserDetailsFail(err.response.data.message));
      setYesDeleting(false);
    }
  };

  return (
    <div>
      {profileLoading ? (
        <Popup text={"Your Profile is Loading"} />
      ) : (
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
                  </div>

                  {inputFields.map((field) => (
                    <InputField
                      key={field.id}
                      type={field.type}
                      id={field.id}
                      name={field.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[field.name]}
                      touched={formik.touched[field.name]}
                      errors={formik.errors[field.name]}
                      placeholder={field.placeholder}
                    />
                  ))}

                  <SpinnerButton
                    bool={profileUpdating}
                    className={
                      "bg-teal-400 text-white px-4 py-2 rounded-full w-full focus:outline-none hover:bg-teal-800 mt-2 disabled:bg-opacity-80"
                    }
                    initialValue={"Update Profile"}
                    nextValue={"Profile is Updating..."}
                  />
                </form>
                <Link to="/createnotes">
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded-full w-full focus:outline-none hover:bg-yellow-600 mt-2 disbled:opacity-80">
                    Create Notes
                  </button>
                </Link>
                {error ? <Message message={error} /> : ""}
                {updateSuccess ? (
                  <p className="text-green-500 font-bold bg-gray-100 border border-green-500 rounded-full mb-5 text-center mt-3">
                    Profile is updated successfully!
                  </p>
                ) : (
                  ""
                )}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={deleteHandlerWithConfirmation}
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
                {showDeleteModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                      <p className="text-2xl font-bold text-gray-800 mb-4">
                        Are you sure you want to delete your profile?
                      </p>
                      <div className="flex gap-4">
                        <SpinnerButton
                          onClick={confirmDeleteHandler}
                          bool={yesDeleting}
                          className={
                            "bg-red-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-red-800 disabled:bg-opacity-80"
                          }
                          initialValue={"yes"}
                          nextValue={"Deleting..."}
                        />
                        <button
                          onClick={closeDeleteModal}
                          className="bg-gray-400 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-gray-600"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Message message={error} />
          )}
        </div>
      )}{" "}
    </div>
  );
};

export default ProfilePage;
