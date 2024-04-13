import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import ActBlock from './modelProg';
import './modelProgBar.css';

const ProgBar = () => {
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [OAN, setOAN] = useState('');
  const [TB, setTB] = useState(0);

  useEffect(() => {
    async function fetchMaxPercentageOAN() {
      try {
        const response = await axios.get('http://localhost:5000/maxPercentageOAN2'); // Use Axios for GET request
        setOAN(response.data.OAN);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchMaxPercentageOAN();
  }, []);

  useEffect(() => {
    async function fetchTotalBlocks() {
      try {
        const response = await axios.get('http://localhost:5000/totalBlocks2'); // Use Axios for GET request
        setTB(response.data.TB);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchTotalBlocks();
  }, []);

  useEffect(() => {
    async function fetchPlacedBlocks() {
      try {
        const response = await axios.get('http://localhost:5000/placedBlocks2'); // Use Axios for GET request
        setCalculatedValue(response.data.PB);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchPlacedBlocks();
  }, []);


  return (
    <div className="ProgBar">
      <h3>{OAN}</h3>
      <ActBlock calculatedValue={calculatedValue} maxValue={TB} />
    </div>
    
  );
};

export default ProgBar;
