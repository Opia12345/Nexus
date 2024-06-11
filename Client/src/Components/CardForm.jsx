import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Custom validation for expiry date
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

const CardForm = ({ def, onSubmit }) => {
  return (
    def === "card" && (
      <Formik
        initialValues={initialValues3}
        validationSchema={validationSchema3}
        onSubmit={onSubmit}
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
    )
  );
};

export default CardForm;
