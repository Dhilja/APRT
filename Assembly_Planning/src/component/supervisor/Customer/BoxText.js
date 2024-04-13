import React, { useState } from 'react';
import TextBoxRow from './TextBoxRow';
import './BoxText.css';

const BoxText = () => {
  const [rowCount, setRowCount] = useState(1); // Initial row count

  const handleRowCountChange = (event) => {
    const newRowCount = parseInt(event.target.value, 10) || 0;
    setRowCount(newRowCount);
  };

  return (
    <div className="BoxText">
    <label className="labels"> No: of series:  </label>
    <input
        type="number"
        value={rowCount}
        onChange={handleRowCountChange}
        min="0"
    />
        
    {Array.from({ length: rowCount }).map((_, index) => (
        <TextBoxRow key={index} />
      ))}
    </div>
  );
};

export default BoxText;
