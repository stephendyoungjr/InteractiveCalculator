import React, { useState } from 'react';

export default function Dice() {
  const [number, setNumber] = useState(1);

  const generateNumber = () => {
    const randomNumber = Math.floor(Math.random() * 12) + 1;
    setNumber(randomNumber);
  };

  return (
    <div className="dice-container">
      <div className="dice-number">{number}</div>
      <button className="generate-button" onClick={generateNumber}>
        Generate
      </button>
    </div>
  );
}
