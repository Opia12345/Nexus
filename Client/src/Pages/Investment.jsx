import {
  faArrowTrendUp,
  faBullseye,
  faNairaSign,
  faShield,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const Investment = () => {
  return (
    <>
      <section className="md:ml-[250px] md:p-8 p-4">
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">Investments</h1>
          </div>
          <Link to="/account">
            <div className="bg-greenBlue h-6 w-6 p-6 rounded-full text-white flex items-center justify-center">
              <FontAwesomeIcon className="text-xl" icon={faUserAlt} />
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          <div className="border rounded-md p-4 md:col-span-2 py-12">
            <div className="flex items-center gap-6">
              <FontAwesomeIcon className="text-2xl" icon={faArrowTrendUp} />
              <div>
                <h1 className="text-md font-thin">Total Income</h1>
                <h5 className="text-2xl font-black">
                  <FontAwesomeIcon icon={faNairaSign} />
                  &nbsp; 0.00
                </h5>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4 py-12">
            <div className="flex items-center gap-8">
              <div>
                <h5 className="text-md font-thin">
                  Expected Return on Investment
                </h5>
                <h1 className="text-2xl font-black">Up to 20%</h1>
                <h5 className="text-md font-thin">Per Anumm</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 grid-cols-1 gap-8 items-center">
          <div className="border rounded-md p-4 md:col-span-2">
            <div className="">
              <span className="flex items-center text-frenchBlue justify-center flex-col p-2 border-b">
                <FontAwesomeIcon className="" icon={faBullseye} />
                <h5 className="border-b-2 border-frenchBlue">My Investment</h5>
              </span>
              <div className="flex items-center justify-center flex-col p-8">
                <h1 className="text-2xl font-black text-frenchBlue">
                  Start Investing
                </h1>
                <h5 className="text-lg font-thin">
                  Start investing in verified opportunities. Let's help you get
                  started.
                </h5>
                <button className="mt-4 bg-frenchBlue text-white px-6 py-2 rounded-md">
                  Get Started
                </button>
                <button className="mt-2 border-frenchBlue border text-black px-6 py-2 rounded-md">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center flex-col">
            <img src="inv2.svg" className="w-[15em]" alt="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Investment;
