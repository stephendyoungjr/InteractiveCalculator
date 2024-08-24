import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const reset = () => {
    setTime(0);
    setIsActive(false);
  };

  return (
    <div className="timer-container">
      <div className="time">{time}s</div>
      <button className="start-button" onClick={() => setIsActive(true)}>
        Start
      </button>
      <button className="stop-button" onClick={() => setIsActive(false)}>
        Stop
      </button>
      <button className="reset-button" onClick={reset}>
        Reset
      </button>
    </div>
  );
}
