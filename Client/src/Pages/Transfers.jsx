import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faSleigh,
  faTimes,
  faTimesCircle,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../Components/Card";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
import { getApiUrl } from "../config";

const Transfers = () => {
  const [passKey, setPassKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pin, setPin] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(null);
  const apiUrl = getApiUrl(process.env.NODE_ENV);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  const initialValues = {
    recipientName: "",
    accountNumber: "",
    amount: "",
    description: "",
    bank: "",
  };

  const initialValues1 = {
    passKey: "",
    Password: "",
  };

  const initialValues2 = {
    Password: "",
  };

  const validationSchema2 = Yup.object({
    Password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 digits"),
  });

  const validationSchema1 = Yup.object({
    PassKey: Yup.string()
      .required("Passkey is required")
      .min(8, "Passkey must be exactly 8 digits"),
    Password: Yup.string().required("Password is required"),
  });

  const validationSchema = Yup.object({
    recipientName: Yup.string().required("Recipient name is required"),
    accountNumber: Yup.string()
      .required("Account number is required")
      .matches(/^\d{10}$/, "Account number must be exactly 10 digits"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be a positive number"),
    description: Yup.string().optional(),
    bank: Yup.string().required("Bank is required"),
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

  const onSubmit = (values, { resetForm }) => {
    const { amount } = values;
    const transferData = JSON.parse(localStorage.getItem("transferData")) || {
      count: 0,
      date: new Date().toDateString(),
    };

    if (transferData.date === new Date().toDateString()) {
      if (transferData.count >= 3) {
        setErr("You have reached the maximum number of transfers for today");
        setTimeout(() => {
          setErr(null);
        }, 4000);
        return;
      }
    } else {
      transferData.count = 0;
      transferData.date = new Date().toDateString();
    }

    if (amount >= 20000) {
      setPassKey(true);
      localStorage.setItem("transferDetails", JSON.stringify(values));
      axios
        .post(`${apiUrl}/pass-key/${userId}`)
        .then((response) => {
          setErr(null);
          resetForm();
        })
        .catch((err) => {
          if (err.response) {
            setErr(err.response.data.error || "An error occurred");
            setTimeout(() => {
              setErr(false);
            }, 4000);
            setIsSubmitting(false);
            resetForm();
          }
        });
    } else {
      setPin(true);
      resetForm();
    }

    transferData.count += 1;
    localStorage.setItem("transferData", JSON.stringify(transferData));
  };

  const handlePin = (values, { resetForm }) => {
    setIsSubmitting(true);
    axios
      .post(`${apiUrl}/password-validate/${userId}`, values)
      .then((response) => {
        setErr(null);
        setSuccess(response.data.message);
        setPin(false);
        setTimeout(() => {
          setSuccess(false);
        }, 6000);
        setIsSubmitting(false);
        resetForm();
      })
      .catch((err) => {
        if (err.response) {
          setErr(err.response.data.error || "An error occurred");
          setTimeout(() => {
            setErr(false);
          }, 4000);
          setIsSubmitting(false);
        }
      });
  };

  const handleSubmit = (values, { resetForm }) => {
    setIsSubmitting(true);
    const transferDetails = JSON.parse(localStorage.getItem("transferDetails"));
    const payload = { ...values, transferDetails };
    axios
      .post(`${apiUrl}/authorize`, payload)
      .then((response) => {
        setErr(null);
        setIsSubmitting(false);
        setSuccess(response.data.message);
        setTimeout(() => {
          setSuccess(false);
        }, 6000);
        setPassKey(false);
        localStorage.removeItem("transferDetails");
        resetForm();
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

  const bankOptions = [
    { value: "", label: "Select a Bank" },
    { value: "United Bank for Africa", label: "United Bank for Africa" },
    { value: "Polaris Bank", label: "Polaris Bank" },
    { value: "Access Bank", label: "Access Bank" },
  ];

  return (
    <>
      <CSSTransition
        in={passKey}
        classNames={myClassNames}
        timeout={300}
        unmountOnExit
      >
        <div className="fixed top-0 right-0 flex items-center justify-center bg-slate-200/5 z-20 w-full h-screen backdrop-blur-md">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-700">
              Input Your Passkey
            </h2>
            <h5>
              Input the passkey sent to your email address to authorize this
              transaction.
            </h5>
            <Formik
              initialValues={initialValues1}
              validationSchema={validationSchema1}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                      Passkey
                    </label>
                    <Field
                      type="text"
                      id="PassKey"
                      name="PassKey"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="PassKey"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="email">
                      Password
                    </label>
                    <Field
                      type="text"
                      id="Password"
                      name="Password"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="Password"
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
                      {isSubmitting ? "Processing..." : "Send"}
                    </button>
                    <button
                      onClick={() => setPassKey(false)}
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

      <CSSTransition
        in={pin}
        classNames={myClassNames}
        timeout={300}
        unmountOnExit
      >
        <div className="fixed top-0 right-0 flex items-center justify-center bg-slate-200/5 z-20 w-full h-screen backdrop-blur-md">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-700">
              Input Your Password
            </h2>
            <Formik
              initialValues={initialValues2}
              validationSchema={validationSchema2}
              onSubmit={handlePin}
            >
              {() => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                      Password
                    </label>
                    <Field
                      type="text"
                      id="Password"
                      name="Password"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="Password"
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
                      {isSubmitting ? "Processing..." : "Send"}
                    </button>
                    <button
                      onClick={() => setPin(false)}
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

      <CSSTransition
        in={success}
        classNames={styles}
        timeout={300}
        unmountOnExit
      >
        <div className="p-4 z-50 shadow-xl bg-white fixed right-3 bottom-20 border-s border-green-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-green-500" icon={faCheckCircle} />
          <h5>{success}</h5>
        </div>
      </CSSTransition>

      <CSSTransition in={err} classNames={styles} timeout={300} unmountOnExit>
        <div className="p-4 shadow-xl z-50 bg-white fixed right-3 bottom-20 border-s border-red-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-red-500" icon={faTimesCircle} />
          <h5>{err}</h5>
        </div>
      </CSSTransition>

      <section className="md:ml-[250px] md:p-8 p-4 bg-gray-50 pb-20">
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">Transfers</h1>
          </div>
          <Link to="/account">
            <div className="bg-greenBlue h-6 w-6 p-6 rounded-full text-white flex items-center justify-center">
              <FontAwesomeIcon className="text-xl" icon={faUserAlt} />
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 mt-8 grid-cols-1 order-2 md:gap-8">
          <div className="mt-8 col-span-2 bg-white shadow-lg rounded-lg p-8">
            <div className="mb-6 text-center">
              <h1 className="font-bold text-4xl text-gray-900">
                Make a Transfer
              </h1>
              <p className="text-gray-600 mt-2">
                Send money to anyone with ease.
              </p>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {() => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="recipientName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Recipient Name
                    </label>
                    <Field
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="recipientName"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Number
                    </label>
                    <Field
                      id="accountNumber"
                      name="accountNumber"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="accountNumber"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bank"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bank
                    </label>
                    <Field
                      as="select"
                      id="bank"
                      name="bank"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {bankOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="bank"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount (Transfers above 20,000 will require a secure pass
                      key)
                    </label>
                    <Field
                      type="text"
                      id="amount"
                      name="amount"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description (optional)
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows="3"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-frenchBlue hover:bg-frenchBlue/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="flex flex-col md:mt-0 mt-8 gap-4 order-first md:order-last items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Accounts
            </h2>

            <Card />
          </div>
        </div>
      </section>
    </>
  );
};

export default Transfers;
