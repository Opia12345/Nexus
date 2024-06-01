import React, { useState } from "react";
import "../tailwind/Output.css";
import Sidenav from "./Components/Sidenav";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
  return (
    <>
      <Sidenav />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
