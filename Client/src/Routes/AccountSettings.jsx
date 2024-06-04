import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEye,
  faEyeSlash,
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config";

const AccountSettings = () => {
  const [password, setPassword] = useState(false);
  const [del, setDel] = useState(false);
  const { userEmail } = useUserContext();
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState(false);
  const apiUrl = getApiUrl(process.env.NODE_ENV);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;
  const { updateUserEmail } = useUserContext();

  const emailSchema = Yup.object().shape({
    Email: Yup.string().email("Invalid email").required("Required"),
  });

  const passwordSchema = Yup.object().shape({
    Password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("Password"), null], "Passwords must match")
      .required("Required"),
  });

  const myClassNames = {
    enter: "opacity-0",
    enterActive: "opacity-100 transition-opacity duration-500 ease-in-out",
    // exit: 'opacity-100',
    exitActive: "opacity-0 transition-opacity duration-500 ease-in-out",
  };

  const styles = {
    enter: "transform translate-x-full opacity-0",
    enterActive:
      "transform -translate-x-0 opacity-100 transition-all duration-500 ease-in-out",
    exitActive:
      "transform translate-x-full opacity-0 transition-all duration-500 ease-in-out",
  };

  const submit = (values, { resetForm }) => {
    setIsSubmitting(true);
    axios
      .patch(`${apiUrl}/email-update/${userId}`, values)
      .then((response) => {
        setErr(null);
        setSuccess(response.data.message);
        updateUserEmail(response.data.userEmail);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
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

  const handleSubmit = (values, { resetForm }) => {
    setIsSubmitting(true);
    axios
      .patch(`${apiUrl}/password-update/${userId}`, values)
      .then((response) => {
        setErr(null);
        setSuccess(response.data.message);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
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
    <>
      <CSSTransition
        in={del}
        classNames={myClassNames}
        timeout={300}
        unmountOnExit
      >
        <div className="fixed top-0 right-0 text-white flex items-center justify-center bg-slate-200/5 z-50 w-full h-screen backdrop-blur-md">
          <div className="p-4 rounded-md flex flex-col items-center gap-4 bg-frenchBlue">
            <FontAwesomeIcon className="text-2xl" icon={faTrashAlt} />
            <h5>Are you sure you want to delete your account?</h5>
            <div className="flex gap-4">
              <button className="border rounded-md px-6 py-2">Delete</button>
              <button
                onClick={() => setDel(false)}
                className="border rounded-md px-6 py-2 bg-white text-black transition-all ease-in-out duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={success}
        classNames={styles}
        timeout={300}
        unmountOnExit
      >
        <div className="p-4 shadow-xl fixed md:right-3 top-10 border-s bg-white border-green-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-green-500" icon={faCheckCircle} />
          <h5>{success}.</h5>
        </div>
      </CSSTransition>

      <CSSTransition in={err} classNames={styles} timeout={300} unmountOnExit>
        <div className="p-4 shadow-xl bg-white fixed md:right-3 top-10 border-s border-red-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-red-500" icon={faTimesCircle} />
          <h5>{err}.</h5>
        </div>
      </CSSTransition>

      <section className="md:ml-[250px] md:p-8 p-4">
        <div className="mt-8 pb-20">
          <div>
            <h1 className="font-bold text-3xl">Account Settings</h1>
          </div>
          <div className="mt-8 col-span-2 bg-white shadow-lg md:w-[60%] rounded-lg p-8">
            <h2 className="font-semibold text-xl">Update Email</h2>
            <Formik
              initialValues={{ Email: "" }}
              validationSchema={emailSchema}
              onSubmit={submit}
            >
              {() => (
                <Form className="mt-4">
                  <div className="mb-4">
                    <label
                      htmlFor="Email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Field
                      id="Email"
                      name="Email"
                      placeholder={userEmail}
                      type="Email"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <ErrorMessage
                      name="Email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-frenchBlue text-white px-4 py-2 rounded-md"
                  >
                    {isSubmitting ? "Updating" : "Update Email"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="mt-12 col-span-2 bg-white shadow-lg md:w-[60%] rounded-lg p-8">
            <h2 className="font-semibold text-xl">Update Password</h2>
            <Formik
              initialValues={{
                Password: "",
                confirmPassword: "",
              }}
              validationSchema={passwordSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-4 mt-4">
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

          <div className="mt-8 col-span-2 bg-white shadow-lg md:w-[60%] rounded-lg p-8">
            <h2 className="font-semibold text-xl">Notification Settings</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="emailNotifications"
                  className="text-sm text-gray-700"
                >
                  Email Notifications
                </label>
                <label className="switch">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    defaultChecked={true}
                    className="checkbox"
                  />
                  <div className="slider"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 col-span-2 bg-white shadow-lg md:w-[60%] rounded-lg p-8">
            <h2 className="font-semibold text-xl">Security</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="emailNotifications"
                  className="text-sm text-gray-700"
                >
                  Two Factor Authentication
                </label>
                <label className="switch">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    defaultChecked={true}
                    className="checkbox"
                  />
                  <div className="slider"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 col-span-2 bg-white shadow-lg md:w-[60%] rounded-lg p-8">
            <h2 className="font-semibold text-xl">Delete Account</h2>
            <div className="mt-4">
              <div className="flex flex-col gap-4 items-start">
                <h5 className="text-sm text-gray-700">
                  Before you proceed with deleting your account, please note
                  that this action is irreversible. Deleting your account will
                  permanently remove all your data, including your personal
                  information, transaction history, and saved settings. If you
                  are sure you want to delete your account, please confirm
                  below.
                </h5>
                <button
                  onClick={() => setDel(true)}
                  className="bg-red-500 text-white px-4 py-2 transition ease-in-out duration-300 hover:bg-red-600 rounded-md"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                  &nbsp; Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountSettings;
