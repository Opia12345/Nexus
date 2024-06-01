import {
  faArrowTrendUp,
  faCheckCircle,
  faDollar,
  faNairaSign,
  faRotate,
  faShield,
  faTimesCircle,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good morning! 🌞";
    } else if (hour < 16) {
      return "Good afternoon! 🫰";
    } else {
      return "Good evening! 🌙";
    }
  };

  const greeting = getGreeting();

  const reload = () => {
    window.location.reload();
  };

  const transactions = [
    {
      status: "valid",
      icon: faCheckCircle,
      to: "Osapolo",
      time: "2 days ago",
      amount: "20,000",
    },
    {
      status: "invalid",
      icon: faTimesCircle,
      to: "Nkechi",
      time: "3 days ago",
      amount: "2,000",
    },
    {
      status: "valid",
      icon: faCheckCircle,
      to: "Chukwuma",
      time: "1 day ago",
      amount: "5,000",
    },
    {
      status: "valid",
      icon: faCheckCircle,
      to: "David",
      time: "a month ago",
      amount: "8,000",
    },
    {
      status: "invalid",
      icon: faTimesCircle,
      to: "Segun",
      time: "9 days ago",
      amount: "23,500",
    },
    {
      status: "valid",
      icon: faCheckCircle,
      to: "Sharon",
      time: "1 day ago",
      amount: "1,000",
    },
  ];

  return (
    <>
      <section className="md:ml-[250px] md:p-8 p-4">
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">USER,</h1>
            <h5 className="text-md mt-4">{greeting}</h5>
          </div>
          <Link to="/account">
            <div className="bg-greenBlue h-6 w-6 p-6 rounded-full text-white flex items-center justify-center">
              <FontAwesomeIcon className="text-xl" icon={faUserAlt} />
            </div>
          </Link>
        </div>
        <FontAwesomeIcon
          onClick={reload}
          icon={faRotate}
          className="text-xl mt-6 cursor-pointer"
        />
        <div className="grid md:grid-cols-2 grid-cols-1 text-white gap-8 mt-8">
          <div className="bg-frenchBlue rounded-md p-4 py-12">
            <div className="flex items-center gap-6">
              <FontAwesomeIcon className="text-2xl" icon={faShield} />
              <div>
                <h1 className="text-gray-200 text-md font-bold">
                  Total Income
                </h1>
                <h5 className="text-2xl font-black">
                  <FontAwesomeIcon icon={faNairaSign} />
                  &nbsp; 73,442
                </h5>
              </div>
            </div>
          </div>
          <div className="bg-black rounded-md p-4 py-12">
            <div className="flex items-center gap-6">
              <FontAwesomeIcon className="text-2xl" icon={faArrowTrendUp} />
              <div>
                <h1 className="text-gray-200 text-md font-bold">
                  Total Investment
                </h1>
                <h5 className="text-2xl font-black">
                  <FontAwesomeIcon icon={faNairaSign} />
                  &nbsp; 0.00
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-20">
          <h1 className="mt-8">Recent Transactions</h1>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8 items-center">
            <div>
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="border rounded-md mt-2 p-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon
                      className={
                        transaction.status === "valid"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                      icon={transaction.icon}
                    />
                    <div>
                      <h5 className="font-bold text-sm">
                        Transfer to {transaction.to}
                      </h5>
                      <h6 className="text-xs text-slate-400">
                        {transaction.time}
                      </h6>
                    </div>
                  </div>
                  <span className="text-xs flex items-center text-slate-400">
                    -<FontAwesomeIcon icon={faNairaSign} />
                    <h5>{transaction.amount}</h5>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center flex-col">
              <img src="inv.svg" className="w-[20em]" alt="" />
              <h1 className="text-slate-400">
                Start Investing today and earn 20% per annum!
              </h1>
              <Link to="/investments">
                <button className="mt-4 bg-frenchBlue text-white px-6 py-2 rounded-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
