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
import CardForm from "../Components/CardForm";

const Transfers = () => {
  const [passKey, setPassKey] = useState(false);
  const [passKey2, setPassKey2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pin, setPin] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(null);
  const [def, setDef] = useState("bank");
  const apiUrl = getApiUrl(process.env.NODE_ENV);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  useEffect(() => {
    axios
      .get(`${apiUrl}/account-status/${userId}`)
      .then((response) => {
        localStorage.setItem("is Locked", response.data.isLocked);
      })
      .catch((err) => {
        console.error("Failed to fetch account status", err);
      });
  }, []);

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
    if (localStorage.getItem("isLocked") === "true") {
      setErr("Your account is temporarily locked. Try again in 24 hours");
      return;
    }

    const { amount } = values;
    const transferData = JSON.parse(localStorage.getItem("transferData")) || {
      count: 0,
      date: new Date().toDateString(),
      transfers: [],
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
      transferData.transfers = [];
    }

    transferData.count += 1;
    transferData.transfers = transferData.transfers || [];
    const timestamp = new Date().toISOString();
    transferData.transfers.push({ ...values, timestamp });
    localStorage.setItem("transferData", JSON.stringify(transferData));

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
  };

  const onSubmit2 = (values, { resetForm }) => {
    if (localStorage.getItem("isLocked") === "true") {
      setErr("Your account is temporarily locked. Try again in 24 hours");
      return;
    }

    const { amount } = values;
    const transferData = JSON.parse(localStorage.getItem("transferData")) || {
      count: 0,
      date: new Date().toDateString(),
      transfers: [],
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
      transferData.transfers = [];
    }

    transferData.count += 1;
    transferData.transfers = transferData.transfers || [];
    const timestamp = new Date().toISOString();
    transferData.transfers.push({ ...values, timestamp });
    localStorage.setItem("transferData", JSON.stringify(transferData));

    if (amount >= 20000) {
      setPassKey2(true);
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

  const validateExpiryDate = (value) => {
    if (!value) {
      return "Expiry date is required";
    }

    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(value)) {
      return "Expiry date must be in MM/YY format";
    }

    const [month, year] = value.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Expiry date must be in the future";
    }

    return null;
  };

  const initialValues3 = {
    cardNumber: "",
    expires: "",
    cvv: "",
    amount: "",
  };

  const validationSchema3 = Yup.object({
    cardNumber: Yup.string()
      .required("Card number is required")
      .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be a positive number"),
  });

  const handleExpiryChange = (e, setFieldValue) => {
    const { value } = e.target;
    if (value.length === 2 && !value.includes("/")) {
      setFieldValue("expires", value + "/");
    } else {
      setFieldValue("expires", value);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    setIsSubmitting(true);
    const transferData = JSON.parse(localStorage.getItem("transferData"));
    const latestTransfer =
      transferData.transfers[transferData.transfers.length - 1];
    const payload = { ...values, transferDetails: latestTransfer };
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

  const handleSubmit2 = (values, { resetForm }) => {
    setIsSubmitting(true);
    const transferData = JSON.parse(localStorage.getItem("transferData"));
    const latestTransfer =
      transferData.transfers[transferData.transfers.length - 1];
    const payload = { ...values, transferDetails: latestTransfer };
    axios
      .post(`${apiUrl}/authorize-card`, payload)
      .then((response) => {
        setErr(null);
        setIsSubmitting(false);
        setSuccess(response.data.message);
        setTimeout(() => {
          setSuccess(false);
        }, 6000);
        setPassKey2(false);
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

  const handleClick = (link) => {
    setDef(link);
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
        in={passKey2}
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
              onSubmit={handleSubmit2}
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
                      onClick={() => setPassKey2(false)}
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

              <div className="flex justify-center items-center mb-12">
                <div className="flex items-center gap-2 bg-slate-200 rounded-lg mt-6">
                  <h5
                    onClick={() => handleClick("bank")}
                    className={` ${
                      def === "bank" ? "bg-frenchBlue text-white" : ""
                    } cursor-pointer px-8 py-1 rounded-md font-semibold`}
                  >
                    Bank
                  </h5>
                  <h5
                    onClick={() => handleClick("card")}
                    className={` ${
                      def === "card" ? "bg-frenchBlue text-white" : ""
                    } cursor-pointer px-8 py-1 rounded-md font-semibold`}
                  >
                    Card
                  </h5>
                </div>
              </div>

              <p className="text-gray-600 mt-2">
                Send money to anyone with ease.
              </p>
            </div>
            {def === "bank" && (
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
                        Amount (Transfers above 20,000 will require a secure
                        pass key)
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
            )}

            {def === "card" && (
              <Formik
                initialValues={initialValues3}
                validationSchema={validationSchema3}
                onSubmit={onSubmit2}
              >
                {({ errors, touched, isSubmitting, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Card Number
                      </label>
                      <Field
                        id="cardNumber"
                        name="cardNumber"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="cardNumber"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="expires"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expires (MM/YY)
                      </label>
                      <Field
                        id="expires"
                        name="expires"
                        placeholder="MM/YY"
                        validate={validateExpiryDate}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => handleExpiryChange(e, setFieldValue)}
                      />
                      {errors.expires && touched.expires && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.expires}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVV
                      </label>
                      <Field
                        id="cvv"
                        name="cvv"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="cvv"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Amount
                      </label>
                      <Field
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
            )}
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
