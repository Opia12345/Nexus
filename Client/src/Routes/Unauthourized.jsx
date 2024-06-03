import React from "react";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <>
      <section className="flex justify-center flex-col h-screen p-8 w-screen items-center">
        <img src="/error.svg" className="lg:w-[30%]" alt="" />
        <h4 className="text-lg text-center">
          Unauthorized access. Please log in to continue.
        </h4>
        <div className="flex flex-col items-center mt-8 gap-4">
          <Link to="/signin">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frenchBlue hover:bg-frenchBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:frenchBlue"
            >
              Login
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Unauthorized;
