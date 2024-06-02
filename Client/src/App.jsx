import React from "react";
import "../tailwind/Output.css";
import Sidenav from "./Components/Sidenav";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Investment from "./Pages/Investment";
import Account from "./Pages/Account";
import Transfers from "./Pages/Transfers";
import AccountSettings from "./Routes/AccountSettings";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";

function App() {
  return (
    <>
      {/* <Sidenav /> */}
      <Routes>
        <Route index path="/" element={<Signup />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/investments" element={<Investment />} />
        <Route path="/account" element={<Account />} />
        <Route path="/transfer" element={<Transfers />} />
        <Route path="/accSettings" element={<AccountSettings />} />
      </Routes>
    </>
  );
}

export default App;
