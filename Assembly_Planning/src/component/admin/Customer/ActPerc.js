import React, { useState, useEffect } from 'react';
import './ActPerc.css';

const ActPerc = ({ calculatedValue, maxValue }) => {
  const [progress, setProgress] = useState(0);

  const progressPercentage = (calculatedValue / maxValue) * 100;

  useEffect(() => {
    setProgress(progressPercentage);
  }, [calculatedValue, maxValue]);

  const circumference = 2 * Math.PI * 45;
  const dashArray = (progress / 100) * circumference;
  const dashOffset = circumference - dashArray;

  return (
    <div className="circular-progress-container">
      <div className="label-container">
        <div className="label1">
          <div className="color-box" style={{ backgroundColor: '#48f96e' }}></div>
          Completed
        </div>
        <div className="label2">
          <div className="color-box" style={{ backgroundColor: '#c60505' }}></div>
          Pending
        </div>
      </div>
      <svg className="circular-progress" viewBox="0 0 100 100">
        <circle
          className="background-circle"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          className="progress-circle"
          cx="50"
          cy="50"
          r="45"
          strokeDasharray={`${dashArray} ${circumference}`}
          strokeDashoffset={dashOffset}
        />
        <text x="50" y="55" className="percentage" transform={`rotate(90 50 50)`}>
          {`${Math.round(progress)}%`}
        </text>
      </svg>
    </div>
  );
};

export default ActPerc;
