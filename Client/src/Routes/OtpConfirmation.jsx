import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getApiUrl } from "../config";
import axios from "axios";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const OtpConfirmation = () => {
  const [seconds, setSeconds] = useState(59);
  const [countdownComplete, setCountdownComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState(false);
  const apiUrl = getApiUrl(process.env.NODE_ENV);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  const styles = {
    enter: "transform translate-x-full opacity-0",
    enterActive:
      "transform -translate-x-0 opacity-100 transition-all duration-500 ease-in-out",
    exitActive:
      "transform translate-x-full opacity-0 transition-all duration-500 ease-in-out",
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(intervalId);
          setCountdownComplete(true);
          return 0;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleResendOTP = () => {
    setSeconds(59);
    setCountdownComplete(false);
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(intervalId);
          setCountdownComplete(true);
          return 0;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);

    axios
      .post(`${apiUrl}/resend-OTP/${userId}`)
      .then((response) => {
        setErr(null);
      })
      .catch((err) => {
        if (err.response) {
          setErr(err.response.data.error || "An error occurred");
          setTimeout(() => {
            setErr(false);
          }, 3000);
        }
      });
  };

  const validationSchema = Yup.object().shape({
    otp: Yup.number().required("OTP is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    setIsSubmitting(true);
    axios
      .post(`${apiUrl}/OTPConfirmation`, values)
      .then((response) => {
        setErr(null);
        setIsSubmitting(false);
        navigate(`/resetPassword/${userId}`);
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

  return (
    <div className="flex bg-[url('/bg2.png')] bg-cover bg-center justify-center bg-blend-darken items-center min-h-screen bg-gray-900/70 p-4">
      <CSSTransition in={err} classNames={styles} timeout={300} unmountOnExit>
        <div className="p-4 shadow-xl bg-white fixed md:right-3 top-10 border-s border-red-500 rounded-md flex items-center gap-4">
          <FontAwesomeIcon className="text-red-500" icon={faTimesCircle} />
          <h5>{err}</h5>
        </div>
      </CSSTransition>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Enter your OTP</h2>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <Field
                  type="number"
                  name="otp"
                  id="otp"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-frenchBlue focus:border-frenchBlue sm:text-sm"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frenchBlue hover:bg-frenchBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frenchBlue"
                >
                  {isSubmitting ? "Loading..." : "Next"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="flex flex-col items-center mt-8 gap-4">
          <small>Didn't receive an OTP?</small>
          {countdownComplete && (
            <button
              onClick={handleResendOTP}
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frenchBlue hover:bg-frenchBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frenchBlue"
            >
              Resend OTP
            </button>
          )}
          {!countdownComplete && (
            <p>
              Resend OTP in {formatTime(Math.floor(seconds / 60))}:
              {formatTime(seconds % 60)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpConfirmation;
