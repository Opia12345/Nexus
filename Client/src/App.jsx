import React from "react";
import "../tailwind/Output.css";
import Sidenav from "./Components/Sidenav";
import { Route, Routes, useLocation } from "react-router-dom";
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

function App() {
  const route = useLocation();

  const sidenav = ![
    "/",
    "/signin",
    "/verifyEmail/:userId",
    "/emailConfirmed",
    "/forgotPassword",
    "/otpConfirmation/:userId",
    "/resetPassword/:userId",
    "/err",
  ].includes(route.pathname);
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
        <Route path="/dashboard" element={<Home />} />
        <Route path="/investments" element={<Investment />} />
        <Route path="/account" element={<Account />} />
        <Route path="/transfer" element={<Transfers />} />
        <Route path="/accSettings" element={<AccountSettings />} />
        <Route path="/err" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
