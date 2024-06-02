import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [password, setPassword] = useState(false);
  const validationSchema = Yup.object({
    Email: Yup.string().email("Invalid email address").required("Required"),
    Password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
  });

  return (
    <div className="flex bg-[url('/bg2.jpg')] bg-cover bg-center justify-center bg-blend-darken items-center min-h-screen bg-gray-900/70 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login to Your Account</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
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
              <div className="mb-6">
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
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frenchBlue hover:bg-frenchBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frenchBlue"
                >
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center flex items-center justify-center text-sm gap-1 text-gray-600">
          Don't have an account?
          <Link to="/">
            <h5 className="text-frenchBlue hover:text-frenchBlue/90">
              Sign up
            </h5>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
