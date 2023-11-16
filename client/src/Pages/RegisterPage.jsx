import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";
import SpinnerButton from "../Components/SpinnerButton";
import Message from "../Components/Message";
import InputField from "../Components/InputField";
import api from "../Components/api";

const RegisterPage = () => {

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const initialValues = {
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
      setLoading(true);
      const res = await api.post(`/api/auth/register`, values);
      if (res.status !== 201) {
        setLoading(false);
        setError(res.data.message);
      }
      setLoading(false);
      setError(null);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500 min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-14 mb-10 h-fit">
        <h2 className="text-2xl font-bold mb-4 text-teal-500 uppercase text-center">
          Register
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
            bool={loading}
            className={
              "bg-teal-400 text-white px-4 py-2 rounded-full w-full focus:outline-none hover:bg-teal-600 mt-2 disabled:opacity-80"
            }
            initialValue={"Register"}
            nextValue={"Registering..."}
          />
          <div className="text-center mt-2">
            <p className="text-black">or</p>
            <OAuth />
          </div>
        </form>
        <div className="flex gap-2 mt-5">
          <p>Have an account?</p>
          <Link to={"/login"}>
            <span className=" text-white px-4 py-2 rounded-full focus:outline-none mt-2 bg-green-400 hover:bg-green-600">Login</span>
          </Link>
        </div>
        {error && <Message message={error} />}
      </div>
    </div>
  );
};

export default RegisterPage;
