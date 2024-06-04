import {
  faCheckCircle,
  faChevronRight,
  faIdCard,
  faQuestion,
  faQuestionCircle,
  faSignOut,
  faSignOutAlt,
  faTimes,
  faTimesCircle,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import Card from "../Components/Card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

const Account = () => {
  const [logout, setLogout] = useState(false);
  const [card, setCard] = useState(false);
  const [help, setHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(null);
  const { username, lastname, userId, userAcc } = useUserContext();

  const initialValues = {
    name: "",
    email: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const userID = import.meta.env.VITE_EMAILJS_USER_ID;

  const onSubmit = (values, { resetForm }) => {
    setIsSubmitting(true);
    const { name, email, message } = values;
    emailjs
      .send(
        serviceId,
        templateId,
        { from_name: name, to_email: email, message: message },
        userID
      )
      .then(
        (result) => {
          if (result.status === 200) {
            setSuccess(true);
            setIsSubmitting(false);
            resetForm();
            setHelp(false);
          }
        },
        (error) => {
          setErr(error);
          setIsSubmitting(false);
          resetForm();
          setHelp(false);
        }
      );
    resetForm();
  };

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

  return (
    <>
      <CSSTransition
        in={success}
        classNames={styles}
        timeout={300}
        unmountOnExit
      >
        <div className="p-4 shadow-xl fixed right-3 bottom-20 border-s border-green-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-green-500" icon={faCheckCircle} />
          <h5>Your message has been delivered.</h5>
        </div>
      </CSSTransition>

      <CSSTransition in={err} classNames={styles} timeout={300} unmountOnExit>
        <div className="p-4 shadow-xl fixed right-3 bottom-20 border-s border-red-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-red-500" icon={faTimesCircle} />
          <h5>{err}.</h5>
        </div>
      </CSSTransition>

      <CSSTransition
        in={logout}
        classNames={myClassNames}
        timeout={300}
        unmountOnExit
      >
        <div className="fixed top-0 right-0 text-white flex items-center justify-center bg-slate-200/5 z-50 w-full h-screen backdrop-blur-md">
          <div className="p-4 rounded-md flex flex-col items-center gap-4 bg-frenchBlue">
            <FontAwesomeIcon className="text-2xl" icon={faSignOut} />
            <h5>Are you sure you want to logout?</h5>
            <div className="flex gap-4">
              <button className="border rounded-md px-6 py-2">Logout</button>
              <button
                onClick={() => setLogout(false)}
                className="border rounded-md px-6 py-2 bg-white text-black transition-all ease-in-out duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={card}
        classNames={myClassNames}
        timeout={300}
        unmountOnExit
      >
        <div className="fixed p-8 top-0 right-0 text-white flex items-center justify-center bg-slate-200/5 z-50 w-full h-screen backdrop-blur-md">
          <div className="p-4 rounded-md flex flex-col items-center gap-4 bg-frenchBlue/60">
            <img src="/ms.svg" alt="" />
            <h5 className="text-2xl font-bold">Card Details</h5>
            <small>Basic Account</small>
            <Card />
            <div className="flex gap-4">
              <button className="border cursor-not-allowed rounded-md px-6 py-2">
                Add a new card
              </button>
              <button
                onClick={() => setCard(false)}
                className="border rounded-md px-6 py-2 bg-white text-black transition-all ease-in-out duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={help}
        classNames={myClassNames}
        timeout={300}
        unmountOnExit
      >
        <div className="fixed top-0 right-0 flex items-center justify-center bg-slate-200/5 z-30 w-full h-screen backdrop-blur-md">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-700">
              Contact Us
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                      Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="email">
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="message">
                      Message
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50"
                      rows="4"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <span className="grid grid-cols-4 gap-2 justify-center items-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 col-span-3 mt-2 border-frenchBlue font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>
                    <button
                      onClick={() => setHelp(false)}
                      className="border w-full px-4 py-2 mt-2 rounded-md"
                    >
                      <FontAwesomeIcon
                        className="text-red-500"
                        icon={faTimes}
                      />
                    </button>
                  </span>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </CSSTransition>

      <section className="md:ml-[250px] md:p-8 p-4">
        <div className="mt-8">
          <div>
            <h1 className="font-bold text-3xl">My Account</h1>
            <p className="text-gray-500 mt-2 text-sm">Basic Account</p>
          </div>
        </div>

        <div className="mt-8 flex items-center flex-col justify-center">
          <div className="bg-greenBlue h-6 w-6 p-12 rounded-full text-white flex items-center justify-center">
            <FontAwesomeIcon className="text-5xl" icon={faUserAlt} />
          </div>
          <h1 className="font-black mt-3 text-2xl">
            {username}&nbsp;
            {lastname}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Account Number: {userAcc}
          </p>
          <p className="text-gray-500 mt-2 text-sm">User ID: {userId}</p>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 mt-8 gap-4">
          <div>
            <Link to="/accSettings">
              <div className="border rounded-md p-2 flex items-center gap-4 justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon icon={faUserAlt} />
                  <h1>Account Settings</h1>
                </div>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </Link>
            <div
              onClick={() => setCard(true)}
              className="border rounded-md p-2 flex items-center gap-4 mt-4 cursor-pointer"
            >
              <FontAwesomeIcon icon={faIdCard} />
              <h1>Card</h1>
            </div>
          </div>

          <div>
            <div
              onClick={() => setHelp(true)}
              className="border rounded-md p-2 flex items-center gap-4 cursor-pointer"
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
              <h1>Help</h1>
            </div>
            <div
              onClick={() => {
                setLogout(true);
              }}
              className="border rounded-md p-2 flex items-center text-red-500 gap-4 mt-4 cursor-pointer"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <h1>Logout</h1>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
