import React, { useState, useEffect } from 'react';
import './ActBlock.css'; // Import the CSS file for styling

const ActBlock = ({ calculatedValue, maxValue }) => {
  const [progress, setProgress] = useState(0);

  // Calculate the progress percentage based on the calculatedValue and maxValue
  const progressPercentage = (calculatedValue / maxValue) * 100;

  // Update the progress state when the calculatedValue changes
  useEffect(() => {
    setProgress(progressPercentage);
  }, [calculatedValue, maxValue]);

  return (
    <div className="progress-container">
        <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="label-container">
        <div className="label1">
          <div className="color-box" style={{ backgroundColor: '#48f96e' }}></div>
          Assigned
        </div>
        <div className="label2">
          <div className="color-box" style={{ backgroundColor: '#c60505' }}></div>
          Not Assigned
          </div>
      </div>
      <div className="values-container">
        <span className="calculated-value">Assigned Blocks : {calculatedValue}</span>
        <span className="max-value">Total Blocks : {maxValue}</span>
      </div>
    </div>
  );
};

export default ActBlock;
