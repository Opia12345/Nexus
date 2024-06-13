import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useCallback } from "react";

const LogoutTimer = ({ onLogout }) => {
  const [inactiveTime, setInactiveTime] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [blurTime, setBlurTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const resetTimer = useCallback(() => {
    setInactiveTime(0);
    setCountdown(10);
  }, []);

  const disableTimer = () => {
    setShowWarning(false);
    setTimerActive(false);
    setInactiveTime(0);
    setCountdown(10);
  };

  useEffect(() => {
    const blurHandler = () => {
      setBlurTime(Date.now());
    };

    const focusHandler = () => {
      const currentTime = Date.now();
      if (blurTime && currentTime - blurTime >= 120000) {
        setShowWarning(true);
        setTimerActive(true);
      } else {
        setBlurTime(0);
      }
    };

    window.addEventListener("blur", blurHandler);
    window.addEventListener("focus", focusHandler);

    const interval = setInterval(() => {
      if (timerActive) {
        setInactiveTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    const countdownInterval = setInterval(() => {
      if (timerActive) {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            return 0;
          }
        });
      }
    }, 1000);

    if (inactiveTime >= 10) {
      onLogout();
    }

    return () => {
      window.removeEventListener("blur", blurHandler);
      window.removeEventListener("focus", focusHandler);
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [inactiveTime, onLogout, resetTimer, timerActive, blurTime]);

  return (
    <>
      {showWarning && (
        <div className="p-4 shadow-xl z-50 bg-white fixed right-3 top-10 border-s border-frenchBlue rounded-md flex items-center gap-4">
          <p className="font-semibold">
            Due to inactivity, we will log you out in {countdown} seconds
          </p>
          <FontAwesomeIcon
            onClick={disableTimer}
            className="text-frenchBlue"
            icon={faTimesCircle}
          />
        </div>
      )}
    </>
  );
};

export default LogoutTimer;
