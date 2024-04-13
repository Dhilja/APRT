import React, { useState, useEffect } from 'react';
import ActBlock from './ActBlock';
import axios from 'axios'
import './ProgBar.css';

const ProgBar = ({sgid}) => {
  const [PB, setPB] = useState(0);
  const [TB, setTB] = useState(0);
  // Simulate a calculated value change (replace this with your actual calculation)

  useEffect(() => {
    async function fetchTotalBlocks() {
      try {
        const response = await axios.get(`http://localhost:5000/totalBlocksClient/${sgid}`); // Use Axios for GET request
        setTB(response.data.TB);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchTotalBlocks();
  }, [sgid]);
  
  useEffect(() => {
    async function fetchPlacedBlocks() {
      try {
        const response = await axios.get(`http://localhost:5000/placedBlocksClient/${sgid}`); // Use Axios for GET request
        setPB(response.data.PB);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }

    fetchPlacedBlocks();
  }, [sgid]);

  return (
    <div className="ProgBar">
      <h3>Active Blocks</h3>
      <ActBlock calculatedValue={PB} maxValue={TB} />
    </div>
  );
};

export default ProgBar;