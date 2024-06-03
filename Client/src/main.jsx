import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./Context/UserContext.jsx";
import { AuthContextProvider } from "./Context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
