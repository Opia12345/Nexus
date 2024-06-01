import React from "react";
import "../tailwind/Output.css";
import Sidenav from "./Components/Sidenav";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Investment from "./Pages/Investment";
import Account from "./Pages/Account";
import Transfers from "./Pages/Transfers";

function App() {
  return (
    <>
      <Sidenav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/investments" element={<Investment />} />
        <Route path="/account" element={<Account />} />
        <Route path="/transfer" element={<Transfers />} />
      </Routes>
    </>
  );
}

export default App;
