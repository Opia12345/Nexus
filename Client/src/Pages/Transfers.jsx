import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import Card from "../Components/Card";
import { Link } from "react-router-dom";

const Transfers = () => {
  const initialValues = {
    recipientName: "",
    accountNumber: "",
    amount: "",
    description: "",
    bank: "",
  };

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

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm();
  };

  const bankOptions = [
    { value: "", label: "Select a Bank" },
    { value: "United Bank for Africa", label: "United Bank for Africa" },
    { value: "Polaris Bank", label: "Polaris Bank" },
    { value: "Access Bank", label: "Access Bank" },
  ];

  return (
    <>
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
              {({ isSubmitting }) => (
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
                      Amount
                    </label>
                    <Field
                      type="number"
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
