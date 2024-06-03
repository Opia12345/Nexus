import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [lastname, setLastName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedUserName = localStorage.getItem("LastName");
    const storedUserFirst = localStorage.getItem("FirstName");
    const storedUserId = localStorage.getItem("userID");
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
    if (storedUserName) {
      setUsername(storedUserName);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedUserFirst) {
      setLastName(storedUserFirst);
    }
  }, []);

  const updateUserEmail = (email) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
  };

  const updateUsername = (name) => {
    setUsername(name);
    localStorage.setItem("FirstName", name);
  };

  const updateUserId = (name) => {
    setUserId(name);
    localStorage.setItem("userID", name);
  };

  const updateUserLast = (name) => {
    setLastName(name);
    localStorage.setItem("LastName", name);
  };

  return (
    <UserContext.Provider
      value={{
        userEmail,
        updateUserEmail,
        username,
        updateUsername,
        userId,
        updateUserId,
        lastname,
        updateUserLast,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
