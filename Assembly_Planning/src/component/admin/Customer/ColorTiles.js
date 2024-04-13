import React, { Component } from 'react';
import './ColorTiles.css'; // Import your global CSS file
import Scanner from './scanner';

class AdminColorTiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      buttons: [],
      showDialog: false,
      dialogData: {},
      showScanner: false,
      showSubmissionDialog: false, // New state for the submission dialog
      submittedMNumber: '', // State to store submitted M Number
      submittedTraceability: '', // State to store submitted Traceability
      OAN:this.props.OAN,
      blockStatus: [],
    };
  }

  async componentDidMount() {
    // Fetch the total count of blocks from the database
    const response = await fetch(`http://localhost:5000/getTotalBlockCount?OAN=${this.props.OAN}`);
    const OAN= this.props.OAN;
  
 // Replace with your server endpoint
    const data = await response.json();
    const redNoValues = data.redNoValues;
    //console.log(redNoValues);

    // Fetch block statuses for the specified OAN
    const statusResponse = await fetch(`http://localhost:5000/getBlockStatus?OAN=${this.props.OAN}`); // Replace with your server endpoint
    const blockStatus = await statusResponse.json();

    // Generate buttons based on the total block count
   // const buttons = Array.from({ length: totalBlockCount }, (_, i) => i + 1);

    this.setState({ buttons : redNoValues, blockStatus: blockStatus, }); 
  }

  openDialog = (buttonLabel, redNo,OAN) => {
    // Fetch MNo and TrNo values from the database
    console.log(OAN);
    fetch(`http://localhost:5000/getBlockAttributes?OAN=${this.props.OAN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redNo,OAN,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            showDialog: true,
            dialogData: {
              label1: 'M Number',
              value1: data.MNo || 'NULL',
              label2: 'Traceability',
              value2: data.TrNo || 'NULL',
              buttonLabel,
            },
            redNo,
          });
        } else {
          console.error('Error fetching block attributes:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  closeDialog = () => {
    this.setState({ showDialog: false });
  };

  closeSubmissionDialog = () => {
    this.setState({ showSubmissionDialog: false });
  };

  toggleScanner = () => {
    this.setState({ showDialog: false });
    this.setState({ showScanner: true });
  };

  // Callback function to handle submission of firstValue and secondValue
  handleSave = (redNo, firstValue, secondValue) => {
    this.setState({
      showScanner: false,
      showSubmissionDialog: true,
      submittedMNumber: firstValue,
      submittedTraceability: secondValue,
      redNoForSubmission: redNo,
    });

    // Make a POST request to update the block attributes
    fetch(`http://localhost:5000/updateBlockAttributes?OAN=${this.props.OAN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redNo,
        MNo: firstValue,
        TrNo: secondValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success or error response, e.g., show a message to the user
        console.log(data.message);

         // Update the UI to reflect the rejection
         this.setState((prevState) => {
          const updatedBlockStatus = prevState.blockStatus.map((block) => {
            if (block.RedNo === redNo) {
              return { ...block, Status: 'Placed' };
            }
            return block;
          });
          return { blockStatus: updatedBlockStatus };
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  };


  handleReject = (redNo, OAN) => {
    this.setState({
      showDialog: false,
    });
    console.log(JSON.stringify({redNo, OAN}));

    // Make a POST request to reject the block attributes
    fetch(`http://localhost:5000/rejectBlockAttributes?OAN=${OAN}`, { // Corrected URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redNo, // 'redNo' is part of the body, not the URL
        OAN,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      // Handle success or error response, e.g., show a message to the user
      console.log(data.message);
  
      // Update the UI to reflect the rejection
      this.setState((prevState) => {
        const updatedBlockStatus = prevState.blockStatus.map((block) => {
          if (block.RedNo === redNo) {
            return { ...block, Status: 'Not Placed' };
          }
          return block;
        });
        return { blockStatus: updatedBlockStatus };
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  

  render() {
    const {
      buttons,
      showDialog,
      dialogData,
      showScanner,
      showSubmissionDialog,
      blockStatus,
    } = this.state;

    return (
      <div className="ColorTiles">
        <div className="buttons-container">
          {buttons.map((button, index) => {
             // Find the status of the corresponding block
             const block = blockStatus.find((block) => block.RedNo === button);
             const status = block ? block.Status : 'unknown';
 
             // Determine the color based on the "status" value
             let colorClass = 'unknown-color';
             if (status === 'Placed') {
               colorClass = 'placed-color';
             } 
             else if (status === 'Not Placed') {
               colorClass = 'not-placed-color';
             }

          return (
            <button
              key={button}
              className={`number-button ${colorClass}`}
              onClick={() => this.openDialog(button, button,this.state.OAN)}
            >
              {button}
            </button>
          );
        })}
        </div>
        
        {showDialog && 
          <div className="dialogbox">
            <h2 style={{ color: 'black' }}>{dialogData.buttonLabel}</h2>
            <div>
              <label style={{ color: 'black' }}>{dialogData.label1}:</label>
              <span style={{ color: 'black' }}>{dialogData.value1}</span>
            </div>
            <div>
              <label style={{ color: 'black' }}>{dialogData.label2}:</label>
              <span style={{ color: 'black' }}>{dialogData.value2}</span>
            </div>
            <br></br>
            <button className="close-button" onClick={this.closeDialog}>
              Close
            </button>
            
            { (dialogData.value2 === 'NULL') ? (  // Check the status and render the appropriate button
              <button className="scan-button" onClick={this.toggleScanner}>
              Scan
              </button>
              ) : (
                <button className="reject-button" onClick={() => this.handleReject(dialogData.buttonLabel, this.state.OAN)}>
                Reject
              </button>
            )}
          </div>
        }
       
        {showScanner && (
          <div className="scanner">
          <Scanner redNo={dialogData.buttonLabel} onSave={this.handleSave} />
        </div>
        )}

        {showSubmissionDialog && (
          <div className="dialogbox">
            <h2>{dialogData.buttonLabel}</h2>
            <div>
              <label>{dialogData.label1}:</label>
              <span>{this.state.submittedMNumber}</span>
            </div>
            <div>
              <label>{dialogData.label2}:</label>
              <span>{this.state.submittedTraceability}</span>
            </div>
            <button className="submit-button" onClick={this.closeSubmissionDialog}>
              Submit
            </button>
          </div>
        )}  
      </div>
    );
  }
}

export default AdminColorTiles;