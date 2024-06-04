import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getApiUrl } from "../config";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;
  const navigate = useNavigate();

  const apiUrl = getApiUrl(process.env.NODE_ENV);
  const validationSchema = Yup.object().shape({
    Email: Yup.string()
      .email("please use a valid email address")
      .required("Email is required"),
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
      .post(`${apiUrl}/passwordReset`, values)
      .then((response) => {
        setErr(null);
        navigate(`/otpConfirmation/${userId}`);
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
    <div className="flex bg-[url('/bg2.png')] bg-cover bg-center justify-center flex-col bg-blend-darken items-center min-h-screen bg-gray-900/70 p-4">
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
        <h2 className="text-2xl font-bold mb-6">Reset your password</h2>
        <Formik
          initialValues={{ Email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Field
                  type="email"
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
                <button
                disabled={isSubmitting}
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frenchBlue hover:bg-frenchBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frenchBlue"
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
