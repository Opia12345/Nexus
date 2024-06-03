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
import { AuthContextProvider } from "./Context/AuthContext";
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
        "/verifyEmail/:userId",
        "/emailConfirmed",
        "/forgotPassword",
        "/otpConfirmation/:userId",
        "/resetPassword/:userId",
      ].includes(route.pathname)
    ) {
      redirect("/err");
    }
  }, [route.pathname, userId, redirect]);

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
    <AuthContextProvider>
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
        <Route path="/dashboard" element={<PrivateRoute element={Home} />} />
        <Route
          path="/investments"
          element={<PrivateRoute element={Investment} />}
        />
        <Route path="/account" element={<PrivateRoute element={Account} />} />
        <Route
          path="/transfer"
          element={<PrivateRoute element={Transfers} />}
        />
        <Route
          path="/accSettings"
          element={<PrivateRoute element={AccountSettings} />}
        />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
