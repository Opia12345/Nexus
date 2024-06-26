import {
  faArrowTrendUp,
  faCheckCircle,
  faDollar,
  faNairaSign,
  faRotate,
  faShield,
  faTemperatureEmpty,
  faTimesCircle,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0); // Initial balance state
  const { username, lastname } = useUserContext();

  useEffect(() => {
    const getTimeDifference = (timestamp) => {
      const now = new Date();
      const transferTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now - transferTime) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

    const getTransactions = () => {
      const transferData = JSON.parse(localStorage.getItem("transferData")) || {
        transfers: [],
      };
      const initialBalance =
        parseFloat(localStorage.getItem("balance")) || 91442213.12;
      let updatedBalance = initialBalance;
      let anyNewTransfers = false;

      const updatedTransactions = transferData.transfers.map((transfer) => {
        if (!transfer.processed) {
          updatedBalance -= parseFloat(transfer.amount);
          transfer.processed = true;
          anyNewTransfers = true;
        }
        return {
          status: "valid", // assuming all saved transactions are valid
          icon: faCheckCircle,
          to: transfer.recipientName || "Transfer from Credit Card",
          time: getTimeDifference(transfer.timestamp), // calculate time difference
          amount: transfer.amount,
          timestamp: transfer.timestamp, // keep timestamp for sorting
        };
      });

      if (anyNewTransfers) {
        // Save the updated balance and transfer data to local storage
        localStorage.setItem("balance", updatedBalance);
        localStorage.setItem("transferData", JSON.stringify(transferData));
      }

      setTransactions(
        updatedTransactions.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      ); // sort transactions
      setBalance(updatedBalance);
    };

    getTransactions();
  }, []);

  const formatNumberWithCommas = (number) => {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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

  return (
    <>
      <section className="md:ml-[250px] md:p-8 p-4">
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">
              {username} {lastname},
            </h1>
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
                  &nbsp; {formatNumberWithCommas(balance)}
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
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mt-12 items-center">
            <div>
              <h1 className="mt-8 font-bold">Recent Transactions</h1>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
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
                          {transaction.to
                            ? `Transfer to ${transaction.to}`
                            : "Transfer From Credit Card"}
                        </h5>
                        <h6 className="text-xs text-slate-400">
                          {transaction.time}
                        </h6>
                      </div>
                    </div>
                    <span className="text-xs flex items-center text-slate-400">
                      <FontAwesomeIcon icon={faNairaSign} />
                      <h5>{transaction.amount}</h5>
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center mt-[40%]">
                  <h5 className="text-md font-semibold">
                    No transactions yet...
                  </h5>
                </div>
              )}
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
