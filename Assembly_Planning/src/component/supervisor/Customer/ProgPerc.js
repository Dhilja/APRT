import React, { useState } from 'react';
import ActPerc from './ActPerc';
import './ProgPerc.css';

  const ProgPerc = ({calculatedValue}) => {
  const maxValue = 100;

  return (
    <div className="ProgPerc">
      <h3>Active Percentage</h3>
      <ActPerc calculatedValue={calculatedValue} maxValue={maxValue} />
    </div>
  );
};

export default ProgPerc;
