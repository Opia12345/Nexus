import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import { useUserContext } from "../Context/UserContext";

const AccountSettings = () => {
  const [del, setDel] = useState(false);
  const { userEmail, updateUserEmail } = useUserContext();

  const emailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Required"),
  });

  const myClassNames = {
    enter: "opacity-0",
    enterActive: "opacity-100 transition-opacity duration-500 ease-in-out",
    // exit: 'opacity-100',
    exitActive: "opacity-0 transition-opacity duration-500 ease-in-out",
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

      <section className="md:ml-[250px] md:p-8 p-4">
        <div className="mt-8 pb-20">
          <div>
            <h1 className="font-bold text-3xl">Account Settings</h1>
          </div>
          <div className="mt-8 col-span-2 bg-white shadow-lg md:w-[60%] rounded-lg p-8">
            <h2 className="font-semibold text-xl">Update Email</h2>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={emailSchema}
              onSubmit={(values) => {
                // Handle email update
                console.log(values);
              }}
            >
              {() => (
                <Form className="mt-4">
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      placeholder={userEmail}
                      type="email"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-frenchBlue text-white px-4 py-2 rounded-md"
                  >
                    Update Email
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="mt-12 col-span-2 bg-white shadow-lg md:w-[60%] rounded-lg p-8">
            <h2 className="font-semibold text-xl">Update Password</h2>
            <Formik
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={passwordSchema}
              onSubmit={(values) => {
                // Handle password update
                console.log(values);
              }}
            >
              {() => (
                <Form className="mt-4">
                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-frenchBlue text-white px-4 py-2 rounded-md"
                  >
                    Update Password
                  </button>
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
                    checked={true}
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
                    checked={true}
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
