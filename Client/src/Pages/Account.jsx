import {
  faIdCard,
  faQuestion,
  faQuestionCircle,
  faSignOut,
  faSignOutAlt,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Account = () => {
  return (
    <>
      <section className="md:ml-[250px] md:p-8 p-4">
        <div className="mt-8">
          <div>
            <h1 className="font-bold text-3xl">My Account</h1>
            <p className="text-gray-500 mt-2">USERS FULL NAME</p>
          </div>
        </div>

        <div className="mt-8 flex items-center flex-col justify-center">
          <div className="bg-greenBlue h-6 w-6 p-12 rounded-full text-white flex items-center justify-center">
            <FontAwesomeIcon className="text-5xl" icon={faUserAlt} />
          </div>
          <h1 className="font-black mt-3 text-2xl">USERS FULL NAME</h1>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 mt-8 gap-4">
          <div>
            <div className="border rounded-md p-2 flex items-center gap-4 cursor-pointer">
              <FontAwesomeIcon icon={faUserAlt} />
              <h1>Account Settings</h1>
            </div>
            <div className="border rounded-md p-2 flex items-center gap-4 mt-4 cursor-pointer">
              <FontAwesomeIcon icon={faIdCard} />
              <h1>Debit Card</h1>
            </div>
          </div>

          <div>
            <div className="border rounded-md p-2 flex items-center gap-4 cursor-pointer">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <h1>Help</h1>
            </div>
            <div className="border rounded-md p-2 flex items-center gap-4 mt-4 cursor-pointer">
              <FontAwesomeIcon className="text-red-500" icon={faSignOutAlt} />
              <h1>Logout</h1>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
