import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  logInFailure,
  logInStart,
  logInSuccess,
} from "../Redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";
import SpinnerButton from "../Components/SpinnerButton";
import Message from "../Components/Message";
import api from "../Components/api";
import InputField from "../Components/InputField";

const LoginPage = () => {

  const inputFields = [
    { type: "email", id: "email", name: "email", placeholder: "Email" },
    {
      type: "password",
      id: "password",
      name: "password",
      placeholder: "Password",
    },
  ];

  const { currentUser, error } = useSelector((state) => state.userSlice);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      setIsLoggingIn(true);
      dispatch(logInStart());
      const res = await api.post(`/api/auth/login`, values);
      dispatch(logInSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(logInFailure(err.response.data.message));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (currentUser) {
      navigate("/profile");
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500 min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-14 mb-10 h-fit">
        <h2 className="text-2xl font-bold mb-4 text-teal-500 uppercase text-center">
          Login
        </h2>

        <form onSubmit={formik.handleSubmit}>
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
            bool={isLoggingIn}
            className={
              "bg-teal-400 text-white px-4 py-2 rounded-full w-full focus:outline-none hover:bg-teal-600 mt-2 disabled:opacity-80"
            }
            initialValue={"Login"}
            nextValue={" loggingIn......"}
          />
        </form>
        <div className="text-center mt-2">
          <p className="text-black">or</p>
          <OAuth />
        </div>
        <div className="flex gap-2 mt-5">
          <p>Dont have an account?</p>
          <Link to={"/register"}>
            <span className=" text-white px-4 py-2 rounded-full focus:outline-none mt-2 bg-red-400 hover:bg-red-600">Sign up</span>
          </Link>
        </div>
        {error && <Message message={error} />}
      </div>
    </div>
  );
};

export default LoginPage;
