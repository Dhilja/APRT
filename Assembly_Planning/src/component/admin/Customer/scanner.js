import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import './scanner.css';

function Scanner({ redNo, onSave }) {
  const [scanResult, setScanResult] = useState(null);
  const [firstValue, setFirstValue] = useState(null);
  const [secondValue, setSecondValue] = useState(null);

  useEffect(() => {
    let scanner = null;

    function success(result) {
      scanner.clear();
      setScanResult(result);

      const formatRegex = /^(\d+)\/(\d+)$/;
      const match = result.match(formatRegex);

      if (match) {
        const first = match[1];
        const second = match[2];
        setFirstValue(first);
        setSecondValue(second);
      }
    }

    function error(err) {
      console.warn(err);
    }

    // Initialize scanner when component mounts
    scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 300,
        height: 300,
      },
      fps: 5,
    });
    scanner.render(success, error);

// Cleanup function to reset permissions and clear scanner when component unmounts
return () => {
  if (scanner) {
    const scannerElement = document.getElementById('reader');
    if (scannerElement) {
      scannerElement.innerHTML = ''; // Clear the scanner element
    }
    scanner.clear();
  }
};


  }, []);

  return (
    <div className="Scanner">
      <h1>QR Scanner</h1>
      {scanResult ? (
        <div className="scanner-result">
          Success: <a href={scanResult}>{scanResult}</a>
          {firstValue && secondValue && (
            <div className="result">
              <div className="mno">
                <label>M Number:</label>
                <span>{firstValue}</span>
              </div>
              <div className="trace">
                <label>Traceability:</label>
                <span>{secondValue}</span>
              </div>
                <button className="save-button" onClick={() => onSave(redNo, firstValue, secondValue)}>
                  Save
                </button>
            </div>
          )}
        </div>
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
}

export default Scanner;
