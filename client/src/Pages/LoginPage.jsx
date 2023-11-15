import React, { useEffect } from "react";
import { useFormik } from "formik";
import {useDispatch, useSelector} from "react-redux"
import * as Yup from "yup";
import axios from "axios";
import { logInFailure, logInStart, logInSuccess } from "../Redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

const LoginPage = () => {

  const {currentUser , error} = useSelector(state=>state.userSlice)

  const dispatch = useDispatch()
  const navigate = useNavigate()

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
    try{
      dispatch(logInStart())
      const res = await axios.post(`${process.env.REACT_APP_HOST_URL}/api/auth/login`,values)
      console.log(res);
      dispatch(logInSuccess(res.data))
      navigate("/")
    }catch(err){
      dispatch(logInFailure(err.response.data.message))
    }
  };

  const formik = useFormik({  
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(()=>{
    if(currentUser){
      navigate('/profile')
    }
  },[])

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500 min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-14 mb-10 h-fit">
        <h2 className="text-2xl font-bold mb-4 text-teal-500 uppercase text-center">
          Login
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              name="email"
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
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
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
            type="submit"
            className="bg-teal-400 text-white px-4 py-2 rounded-full w-full focus:outline-none hover:bg-teal-800 mt-2"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-black">or</p>
          <OAuth/>
        </div>
        <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/register'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
