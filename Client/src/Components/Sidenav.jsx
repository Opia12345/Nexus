import {
  faBarsStaggered,
  faCircleQuestion,
  faGear,
  faHomeAlt,
  faKey,
  faLock,
  faPiggyBank,
  faPowerOff,
  faTimes,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidenav = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

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
      {!mobile && (
        <>
          <nav className="w-[250px] h-screen py-10 bg-greenBlue text-white z-50 fixed left-0 top-0 p-8 flex flex-col justify-between">
            <div className="">
              <div className="flex gap-4 justify-center items-center mb-8">
                <img src="/logo.png" alt="" />
                <h5 className="font-black text-xl">Nexus Bank</h5>
              </div>
              <span
                onClick={() => handleLinkClick("/")}
                className={`cursor-pointer p-2 ${
                  activeLink === "/"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
              >
                <FontAwesomeIcon icon={faHomeAlt} />
                <h5>Home</h5>
              </span>

              <span
                className={`cursor-pointer p-2 ${
                  activeLink === "/generator"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
              >
                <FontAwesomeIcon icon={faPiggyBank} />
                <h5>Invest</h5>
              </span>

              <span
                className={`cursor-pointer p-2 ${
                  activeLink === "/settings"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
              >
                <FontAwesomeIcon icon={faUserAlt} />
                <h5>Account</h5>
              </span>

              <span
                className={`cursor-pointer p-2 ${
                  activeLink === "/help"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center gap-4`}
              >
                <FontAwesomeIcon icon={faCircleQuestion} className="text-lg" />
                <h5>Help</h5>
              </span>
            </div>
            <span
              className={`cursor-pointer p-2 ${
                activeLink === "/dashboard"
                  ? "border-s bg-slate-200/20 rounded-md"
                  : ""
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
              <span
                onClick={() => handleLinkClick("/")}
                className={`cursor-pointer p-2 flex-col text-slate-200 gap-2 ${
                  activeLink === "/"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
              >
                <FontAwesomeIcon icon={faHomeAlt} />
                <h5 className="text-xs">Home</h5>
              </span>

              <span
                className={`cursor-pointer p-2 flex-col text-slate-200 gap-2 ${
                  activeLink === "/generator"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
              >
                <FontAwesomeIcon icon={faPiggyBank} />
                <h5 className="text-xs">Invest</h5>
              </span>

              <span
                className={`cursor-pointer p-2 flex-col  text-slate-200 gap-2${
                  activeLink === "/settings"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
              >
                <FontAwesomeIcon icon={faUserAlt} />
                <h5 className="text-xs">Account</h5>
              </span>

              <span
                className={`cursor-pointer p-2 flex-col text-slate-200 gap-2${
                  activeLink === "/help"
                    ? "border-s bg-slate-200/20 rounded-md"
                    : ""
                } hover:bg-slate-200/5 transition ease-in-out duration-300 flex items-center`}
              >
                <FontAwesomeIcon icon={faCircleQuestion} className="text-lg" />
                <h5 className="text-xs">Help</h5>
              </span>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Sidenav;
