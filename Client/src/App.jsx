import React, { useEffect } from "react";
import "../tailwind/Output.css";
import Sidenav from "./Components/Sidenav";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Investment from "./Pages/Investment";
import Account from "./Pages/Account";
import Transfers from "./Pages/Transfers";
import AccountSettings from "./Routes/AccountSettings";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import VerifyEmail from "./Routes/VerifyEmail";
import EmailConfirmed from "./Routes/EmailConfirmed";
import ForgotPassword from "./Routes/ForgotPassword";
import OtpConfirmation from "./Routes/OtpConfirmation";
import ResetPassword from "./Routes/ResetPassword";
import Unauthorized from "./Routes/Unauthourized";
import PrivateRoute from "./Routes/PrivateRoute";

function App() {
  const redirect = useNavigate();
  const route = useLocation();
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  useEffect(() => {
    if (
      !userId &&
      ![
        "/",
        "/signin",
        `/verifyEmail/${userId}`,
        "/emailConfirmed",
        "/forgotPassword",
        `/otpConfirmation/${userId}`,
        `/resetPassword/${userId}`,
      ].includes(route.pathname)
    ) {
      redirect("/err");
    }
  }, [route.pathname, userId, redirect]);

  const hideSidenavRoutes = [
    "/",
    "/signin",
    /^\/verifyEmail\/\w+$/,
    "/emailConfirmed",
    "/forgotPassword",
    "/resetPassword/:userId",
    /^\/otpConfirmation\/\w+$/,
    /^\/resetPassword\/\w+$/,
    "/err",
  ];

  const sidenav = !hideSidenavRoutes.some((pattern) =>
    typeof pattern === "string"
      ? pattern === route.pathname
      : pattern.test(route.pathname)
  );

  return (
    <>
      {sidenav && <Sidenav />}
      <Routes>
        <Route index path="/" element={<Signup />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/verifyEmail/:userId" element={<VerifyEmail />} />
        <Route path="/emailConfirmed" element={<EmailConfirmed />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/otpConfirmation/:userId" element={<OtpConfirmation />} />
        <Route path="/resetPassword/:userId" element={<ResetPassword />} />
        <Route path="/err" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <PrivateRoute>
              <Investment />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <PrivateRoute>
              <Transfers />
            </PrivateRoute>
          }
        />
        <Route
          path="/accSettings"
          element={
            <PrivateRoute>
              <AccountSettings />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
