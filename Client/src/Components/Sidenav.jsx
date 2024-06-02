import {
  faHomeAlt,
  faMoneyBillTransfer,
  faPiggyBank,
  faPowerOff,
  faSignOut,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const Sidenav = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [logout, setLogout] = useState(false);

  const myClassNames = {
    enter: "opacity-0",
    enterActive: "opacity-100 transition-opacity duration-500 ease-in-out",
    // exit: 'opacity-100',
    exitActive: "opacity-0 transition-opacity duration-500 ease-in-out",
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMobileNav(false);
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
    };
    handleResize(); // Set the initial value
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <CSSTransition
        in={logout}
        classNames={myClassNames}
        timeout={300}
        unmountOnExit
      >
        <div className="fixed top-0 right-0 text-white flex items-center justify-center bg-slate-200/5 z-50 w-full h-screen backdrop-blur-md">
          <div className="p-4 rounded-md flex flex-col items-center gap-4 bg-frenchBlue">
            <FontAwesomeIcon className="text-2xl" icon={faSignOut} />
            <h5>Are you sure you want to logout?</h5>
            <div className="flex gap-4">
              <button className="border rounded-md px-6 py-2">Logout</button>
              <button
                onClick={() => setLogout(false)}
                className="border rounded-md px-6 py-2 bg-white text-black transition-all ease-in-out duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>
      {!mobile && (
        <>
          <nav className="w-[250px] h-screen py-10 bg-greenBlue text-white z-20 fixed left-0 top-0 p-8 flex flex-col justify-between">
            <div className="">
              <div className="flex gap-4 justify-center items-center mb-8">
                <img src="/logo.png" alt="" />
                <h5 className="font-black text-xl">Nexus Bank</h5>
              </div>
              <NavLink to="/dashboard" onClick={() => handleLinkClick("/")}>
                <span
                  className={`cursor-pointer p-2 ${
                    activeLink === "/dashboard"
                      ? "border-s bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
                >
                  <FontAwesomeIcon icon={faHomeAlt} />
                  <h5>Home</h5>
                </span>
              </NavLink>

              <NavLink to="/investments">
                <span
                  onClick={() => handleLinkClick("/investments")}
                  className={`cursor-pointer p-2 ${
                    activeLink === "/investments"
                      ? "border-s bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
                >
                  <FontAwesomeIcon icon={faPiggyBank} />
                  <h5>Investments</h5>
                </span>
              </NavLink>

              <NavLink to="/transfer">
                <span
                  onClick={() => handleLinkClick("/transfer")}
                  className={`cursor-pointer p-2 ${
                    activeLink === "/transfer"
                      ? "border-s bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
                >
                  <FontAwesomeIcon icon={faMoneyBillTransfer} />
                  <h5>Transfers</h5>
                </span>
              </NavLink>

              <NavLink to="/account">
                <span
                  onClick={() => handleLinkClick("/account")}
                  className={`cursor-pointer p-2 ${
                    activeLink === "/account"
                      ? "border-s bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
                >
                  <FontAwesomeIcon icon={faUserAlt} />
                  <h5>Account</h5>
                </span>
              </NavLink>
            </div>
            <span
              onClick={() => setLogout(true)}
              className={`cursor-pointer p-2 ${
                activeLink === "//" ? "border-s bg-slate-200/20 rounded-md" : ""
              } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
            >
              <FontAwesomeIcon icon={faPowerOff} />
              <h5>Logout</h5>
            </span>
          </nav>
        </>
      )}

      {mobile && (
        <>
          <nav className="h-[70px] bg-greenBlue text-white z-50 w-full fixed left-0 bottom-0 p-2">
            <div className="flex items-center justify-center gap-8">
              <NavLink to="/dashboard" onClick={() => handleLinkClick("/")}>
                <span
                  onClick={() => handleLinkClick("/dashboard")}
                  className={`cursor-pointer p-2 flex-col text-slate-200 gap-2 ${
                    activeLink === "/dashboard"
                      ? "border-b bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
                >
                  <FontAwesomeIcon icon={faHomeAlt} />
                  <h5 className="text-xs">Home</h5>
                </span>
              </NavLink>

              <NavLink to="/investments">
                <span
                  onClick={() => handleLinkClick("/investments")}
                  className={`cursor-pointer p-2 flex-col text-slate-200 gap-2 ${
                    activeLink === "/investments"
                      ? "border-b bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
                >
                  <FontAwesomeIcon icon={faPiggyBank} />
                  <h5 className="text-xs">Investments</h5>
                </span>
              </NavLink>

              <NavLink to="/transfer">
                <span
                  onClick={() => handleLinkClick("/transfer")}
                  className={`cursor-pointer p-2 flex-col text-slate-200 gap-2 ${
                    activeLink === "/transfer"
                      ? "border-b bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
                >
                  <FontAwesomeIcon icon={faMoneyBillTransfer} />
                  <h5 className="text-xs">Transfers</h5>
                </span>
              </NavLink>

              <NavLink to="/account">
                <span
                  onClick={() => handleLinkClick("/account")}
                  className={`cursor-pointer p-2 flex-col text-slate-200 gap-2 ${
                    activeLink === "/account"
                      ? "border-b bg-slate-200/20 rounded-md"
                      : ""
                  } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
                >
                  <FontAwesomeIcon icon={faUserAlt} />
                  <h5 className="text-xs">Account</h5>
                </span>
              </NavLink>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Sidenav;
