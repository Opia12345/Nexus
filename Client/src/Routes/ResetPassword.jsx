import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEye,
  faEyeSlash,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
import { getApiUrl } from "../config";

const ResetPassword = () => {
  const [password, setPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const apiUrl = getApiUrl(process.env.NODE_ENV);
  const userId = localStorage.getItem("userId");

  const validationSchema = Yup.object({
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
      .patch(`${apiUrl}/password-update/${userId}`, values)
      .then((response) => {
        setErr(null);
        setSuccess(response.data.message);
        setTimeout(() => {
          navigate(`/signin`);
        }, 4000);
        resetForm();
        setIsSubmitting(false);
      })
      .catch((err) => {
        if (err.response) {
          setErr(err.response.data.error || "An error occurred");
          setTimeout(() => {
            setErr(false);
          }, 3000);
          setIsSubmitting(false);
        }
      });
  };

  return (
    <div className="flex bg-[url('/bg2.png')] bg-cover bg-center justify-center flex-col bg-blend-darken items-center min-h-screen bg-gray-900/70 p-4">
      <CSSTransition
        in={success}
        classNames={styles}
        timeout={300}
        unmountOnExit
      >
        <div className="p-4 shadow-xl fixed md:right-3 top-10 border-s bg-white border-green-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-green-500" icon={faCheckCircle} />
          <h5>
            {success} You can now{" "}
            <Link to="/signin" className="underline">
              Login
            </Link>
          </h5>
        </div>
      </CSSTransition>

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
        <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>
        <Formik
          initialValues={{
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
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
