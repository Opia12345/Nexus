import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getApiUrl } from "../config";
import axios from "axios";
import { CSSTransition } from "react-transition-group";

const Signup = () => {
  const [password, setPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState(false);
  const apiUrl = getApiUrl(process.env.NODE_ENV);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    LastName: Yup.string().required("Last Name is required"),
    FirstName: Yup.string().required("First Name is required"),
    Email: Yup.string()
      .email("Please use a valid email address")
      .required("Email is required"),
    Password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("Password"), null], "Passwords must match")
      .required("Required"),
  });

  const styles = {
    enter: "transform translate-x-full opacity-0",
    enterActive:
      "transform -translate-x-0 opacity-100 transition-all duration-500 ease-in-out",
    exitActive:
      "transform translate-x-full opacity-0 transition-all duration-500 ease-in-out",
  };

  const handleSubmit = (values, { resetForm }) => {
    setIsSubmitting(true);
    axios
      .post(`${apiUrl}/register`, values)
      .then((response) => {
        setErr(null);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate(`/verifyEmail/:userId`);
        resetForm();
        setIsSubmitting(false);
      })
      .catch((err) => {
        if (err.response) {
          setErr(err.response.data.error);
          setTimeout(() => {
            setErr(false);
          }, 3000);
          setIsSubmitting(false);
        }
      });
  };

  return (
    <div className="flex bg-[url('/bg2.png')] bg-cover bg-center flex-col justify-center bg-blend-darken items-center min-h-screen bg-gray-900/70 p-4">
      <CSSTransition in={err} classNames={styles} timeout={300} unmountOnExit>
        <div className="p-4 shadow-xl bg-white fixed md:right-3 top-10 border-s border-red-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-red-500" icon={faTimesCircle} />
          <h5>{err}.</h5>
        </div>
      </CSSTransition>
      <div className="flex items-center flex-col mb-8">
        <div className="flex justify-center flex-col items-center">
          <img src="/logo.png" className="w-[100px]" alt="" />
          <h5 className="text-white font-black text-4xl">Nexus Bank</h5>
        </div>
        <small className="text-slate-400 font-semibold">
          Banking done the right way...
        </small>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
        <Formik
          initialValues={{
            LastName: "",
            FirstName: "",
            Email: "",
            Password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <Field
                  type="text"
                  name="LastName"
                  id="LastName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-frenchBlue focus:border-frenchBlue sm:text-sm"
                />
                <ErrorMessage
                  name="LastName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <Field
                  type="text"
                  name="FirstName"
                  id="FirstName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-frenchBlue focus:border-frenchBlue sm:text-sm"
                />
                <ErrorMessage
                  name="FirstName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Field
                  type="Email"
                  name="Email"
                  id="Email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-frenchBlue focus:border-frenchBlue sm:text-sm"
                />
                <ErrorMessage
                  name="Email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <span className="mt-1 flex items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-frenchBlue focus:border-frenchBlue sm:text-sm">
                  <Field
                    type={password ? "text" : "password"}
                    name="Password"
                    id="Password"
                    className="w-full border-none outline-none"
                  />
                  <FontAwesomeIcon
                    onClick={() => setPassword(!password)}
                    icon={password ? faEye : faEyeSlash}
                  />
                </span>
                <ErrorMessage
                  name="Password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <span className="mt-1 flex items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-frenchBlue focus:border-frenchBlue sm:text-sm">
                  <Field
                    type={password ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    className="w-full border-none outline-none"
                  />
                  <FontAwesomeIcon
                    onClick={() => setPassword(!password)}
                    icon={password ? faEye : faEyeSlash}
                  />
                </span>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frenchBlue hover:bg-frenchBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:frenchBlue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Register"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm flex justify-center items-center gap-1 text-gray-600">
          Already have an account?
          <Link to="/signin">
            <h5 className="text-frenchBlue hover:text-frenchBlue/90">Log in</h5>
          </Link>
        </p>
        <small className="flex justify-center text-gray-400 mt-4">
          Built and designed by Uche Chinyere
        </small>
      </div>
    </div>
  );
};

export default Signup;
