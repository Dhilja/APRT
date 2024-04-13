// server.js

const express = require('express');
const app = express();
const pg = require('pg');
const { Pool } = pg;
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const multer = require('multer');
const path = require('path');

const pool = new Pool({

  user: 'postgres',
  host: '127.0.0.1',
  database: 'SaintGobain-SEFPRO',  //change it to the corresponding dsatabase and password
  password: 'arcane@gk',
  port: 5432, // default PostgreSQL port
});


const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST','PUT','DELETE'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});


app.use(cors());

app.use(bodyParser.json());
const clientId = "hQd7ISBoA79IXZiMQyNwNjmA2tlFAuYm";
const clientSecret = "7XsA00C7MaGdhmqM";

const PORT = 5000; // or any port number you prefer
io.on('connection', (socket) => {
  console.log('A client connected.');

  // When a new pad is added, emit the data to all connected clients
  socket.on('newPadAdded', (data) => {
    console.log('WebSocket data emitted:', data);
    io.emit('padAdded', data);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});


app.get('/api/data', (req, res) => {
  pool.query('SELECT area_number,plant_number,total_area,available_area,occupied_area,status FROM apad_assembly_area', (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });
});

app.post('/api/data', (req, res) => {
  const { areaNumber, plantNumber,length , breadth ,padLength,padBreadth,rows,columns } = req.body;
   // Replace column1, column2, column3 with actual column names in your "assembly_pads" table
   
   

  // Assuming you have three columns - column1, column2, and column3
  const query = 'INSERT INTO apad_assembly_area (area_number,plant_number,length,breadth,pad_length,pad_breadth,rows,columns,status) VALUES ($1, $2, $3 , $4 ,$5 ,$6,$7,$8,$9)';

  pool.query(query, [areaNumber,plantNumber,length,breadth,padLength,padBreadth,rows,columns,'active'], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    }

    else {
      // Emit the 'newPadAdded' event with the newly added data
      const newData = {
        area_number: areaNumber,
        plant_number: plantNumber,
        total_area: length * breadth,
        available_area:(length*breadth),
        occupied_area: 0.0,
        status:'active',
      };
      io.emit('newPadAdded', newData);

  
    res.json({ message: 'Data inserted successfully!' });
    }
  });
});



app.put('/api/updateStatus/:areaNumber', (req, res) => {
  const { status } = req.body;
  const areaNumber = req.params.areaNumber;

  // Update the status in the database using a SQL query (you will need to use your database library here)
  const query = 'UPDATE apad_assembly_area SET status = $1 WHERE area_number = $2';

  pool.query(query, [status, areaNumber], (error, result) => {
    if (error) {
      console.error('Error updating status in the database:', error);
      res.status(500).json({ error: 'Error updating status in the database' });
    } else {
      res.status(200).json({ message: 'Status updated successfully' });
    }
  });
});


// ... existing code ...

app.get('/api/data/:areaNumber', (req, res) => {
  const { areaNumber } = req.params;

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = 'SELECT * FROM apad_assembly_area WHERE area_number = $1';

  pool.query(query, [areaNumber], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.put('/api/data/:areaNumber', (req, res) => {

  const { area_number, length, breadth,pad_length,pad_breadth,rows,columns} = req.body;

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = 'UPDATE apad_assembly_area SET  length = $2, breadth = $3,pad_length = $4,pad_breadth = $5,rows=$6,columns=$7 WHERE area_number = $1';
  console.log('Received data for update:', { area_number, length, breadth, pad_length, pad_breadth, rows, columns });
  pool.query(query, [area_number, length, breadth, pad_length, pad_breadth, rows,columns], (error, result) => {
    if (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Error updating data' });
    } else {
      // Emit the 'padUpdated' event with the updated data
      const updatedData = {
        area_number: area_number,
        total_area: length * breadth,
        available_area: length * breadth,
        occupied_area: 0.0,
      };

     
      io.emit('padUpdated', updatedData);

      res.json({ message: 'Data updated successfully!' });
    }
  });
});

// ... existing code ...






//planning page

app.post('/api/product', (req, res) => {
  const { customerName, oaNumber, drawingNumber, modelName, length, breadth, height,inspection } = req.body;
  
  const query = 'INSERT INTO apad_product (customer_name,oa_number,drawing_number,module_name,length,breadth,height,inspection_date) VALUES ($1, $2, $3 , $4 ,$5 ,$6, $7, $8)';

  pool.query(query, [customerName,oaNumber,drawingNumber,modelName,length,breadth,height,inspection], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      
      if (error.code === '23505') {
        // Duplicate key violation (unique constraint)
        const duplicateParam = error.detail.match(/\((.*?)\)/)[1];
        res.status(400).json({ error: `Duplicate value for parameter: ${duplicateParam}. Ensure uniqueness of parameters.` });
      } else if (error.code === '500') {
        // Not null violation
        const missingParam = error.column;
        res.status(400).json({ error: `Missing value for parameter: ${missingParam}. All parameters are required.` });
      } else {
        // Generic error message for other errors
        res.status(500).json({ error: 'Error inserting data.' });
      }
    }

    else 
    {
      res.status(200).json({ message: 'Data inserted successfully' });

    }


    
  });
  
});


app.get('/api/product/:oa_number', (req, res) => {
  const { oa_number } = req.params;

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = 'SELECT drawing_number from apad_product WHERE oa_number = $1';

  pool.query(query, [oa_number], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

const storage = multer.diskStorage({
  destination: './uploads', // Set your desired file upload directory here
  filename: (req, file, cb) => {
    // Use the drawing number as the filename
    const drawingNumber = req.params.drawingNumber;
    const ext = path.extname(file.originalname);
    const filename = `${drawingNumber}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const APS = require('forge-apis');
const qs = require('querystring');
app.use(bodyParser.urlencoded({ extended: false }));

// API endpoint for file upload
app.post('/api/upload/:drawingNumber', upload.single('file'), async (req, res) => {
  const drawingNumber = req.params.drawingNumber;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Perform authentication to get an access token
    const accessToken = await performAuthentication(clientId, clientSecret);

    // Create a new Forge Data Management client
    const client = new APS.AuthClientTwoLegged(clientId, clientSecret, [
      'data:read', 'data:write', 'data:create', 'data:search', 'bucket:create', 'bucket:read'
    ], true);

    

    client.credentials = { access_token: accessToken };

    // Start a database transaction
    await pool.query('BEGIN');

    // Insert the file data into the database
    const insertQuery = `
      INSERT INTO files (drawing_number, file_name, file_path) VALUES ($1, $2, $3)`;

    const filePath = path.join('./uploads', `${drawingNumber}${path.extname(file.originalname)}`);
    const values = [drawingNumber, drawingNumber, filePath];

    try {
      await pool.query(insertQuery, values);
      console.log("Insert successful");
    } catch (error) {
      console.error("Error inserting data:", error);
      // Handle the error or return an appropriate response
    }

    // Upload the file to Autodesk Forge and get the URN
    const bucketKey = 'vygn-real-time-tracker'; // Change this to your specific bucket key
    const objectName = `${drawingNumber}${path.extname(file.originalname)}`;
    console.log("Before uploading");

   
try {
  // Wait for the file upload to complete
  
  const uploadResponse = await client.objects.upload(bucketKey, objectName, file, {});
  console.log("Upload successful");

  const urn = uploadResponse.body.objectId;

  // Update the file data in the database with the URN
  const updateQuery = `
    UPDATE files SET urn = $1 WHERE drawing_number = $2`;

  const updateValues = [urn, drawingNumber];

  await pool.query(updateQuery, updateValues);

  // Commit the database transaction
  await pool.query('COMMIT');

  // Return a success response to the client
  res.json({ message: 'Data updated successfully' });
} catch (error) {
  // Handle and log any upload errors
  console.error("Upload error:", error);

  // Roll back the database transaction if there is an error
  await pool.query('ROLLBACK');

  // Return an error response to the client
  res.status(500).json({ message: 'Error' });
}
  }catch(error){
    console.error(" error:", error);

  }
});


async function performAuthentication(clientId, clientSecret) {
  const data = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'data:read data:write data:create data:search bucket:create bucket:read',
  });

  try {
    const response = await axios.post('https://developer.api.autodesk.com/authentication/v1/authenticate', data, {
      timeout: 25000, 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('Authentication response:', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}



//slicing page
app.post('/api/slicedparts', (req, res) => {
  const { sliceName,length,breadth,height,startDate,endDate,blocks,drawingNumber } = req.body;
  
  const query = 'INSERT INTO apad_slicedparts(slice_name,length,breadth,height,start_date,end_date,no_of_blocks,drawing_number) VALUES ($1, $2, $3 , $4 ,$5 ,$6, $7, $8)';

  pool.query(query, [sliceName,length,breadth,height,startDate,endDate,blocks,drawingNumber], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      
      res.status(500).json({ error: 'Error inserting data' });
    }

    else 
    {
      res.status(200).json({ message: 'Data inserted successfully' });

    }


    
  });
  
});


app.get('/api/slicedparts/:drawingNumber', (req, res) => {
  const { drawingNumber } = req.params;

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = `
  SELECT id, slice_name, length, breadth, height,
    to_char(start_date, 'YYYY-MM-DD') as start_date,
    to_char(end_date, 'YYYY-MM-DD') as end_date
  FROM apad_slicedparts
  WHERE drawing_number = $1;
`;

  pool.query(query, [drawingNumber], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
      
    }
  });
});



// Endpoint to insert additional data and fetch corresponding footprint area and occupied area
app.post('/api/slicedparts/:id', (req, res) => {
  const { id } = req.params;
  const { additionalLength, additionalBreadth, walkAroundDistance } = req.body;

  // Insert the additional data into the database
  const insertQuery = `
      UPDATE  apad_slicedparts SET additional_length =$2, additional_breadth =$3, walkaround_distance=$4 
      where id = $1`;

  pool.query(insertQuery, [id, additionalLength, additionalBreadth, walkAroundDistance], (insertError, insertResult) => {
    if (insertError) {
      console.error('Error inserting data:', insertError);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      // Fetch the corresponding footprint area and occupied area for the same drawing number
      const fetchQuery = `
        SELECT footprint_area, occupied_area
        FROM apad_slicedparts
        WHERE id = $1
        `;

      pool.query(fetchQuery, [id], (fetchError, fetchResult) => {
        if (fetchError) {
          console.error('Error fetching data:', fetchError);
          res.status(500).json({ error: 'Error fetching data' });
        } else {
          res.json(fetchResult.rows[0]);
        }
      });
    }
  });
});

app.get('/api/plants', (req, res) => {
  

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = 'SELECT distinct plant_number from apad_assembly_area';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/areas', (req, res) => {
  

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = `SELECT area_number,plant_number,length,breadth from apad_assembly_area where status='active'`;

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/area/:area_number', (req, res) => {
  const { area_number } = req.params;

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = 'SELECT rows,columns,pad_length,pad_breadth from apad_assembly_area WHERE area_number = $1';

  pool.query(query, [area_number], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.get('/api/tile/:id', (req, res) => {
  const { id } = req.params;

  // Replace 'apad_assembly_area' with the actual name of your table
  const query = `SELECT
  sp.foot_length,
  sp.foot_breadth,
  sp.occ_length,
  sp.occ_breadth,
  p.customer_name
FROM
apad_slicedparts AS sp
JOIN
apad_product AS p ON sp.drawing_number = p.drawing_number
WHERE
  sp.id = $1`


  pool.query(query, [id], (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows[0]);
    }
  });
});


app.post('/api/sliceposition', (req, res) => {
 
  const {id, x, y, area_number, color, drawing_number } = req.body;
  

  const query = 'INSERT into apad_sliceposition(id,x,y,area_number,color,drawing_number) values ($1,$2,$3,$4,$5,$6)';

  pool.query(query, [id,x, y, area_number, color, drawing_number], (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/sliceposition/:id', (req, res) => {
 
  const { id } = req.params;
  // Replace 'apad_assembly_area' with the actual name of your table
  const query = `
  SELECT
    s.id,
    p.slice_name,
    s.x,
    s.y,
    s.area_number,
    s.color,
    s.drawing_number,
    p.height,
    p.foot_length,
    p.foot_breadth,
    p.occ_length,
    p.occ_breadth,
    pt.customer_name,
    to_char(pt.inspection_date, 'YYYY-MM-DD') as inspection_date,
    to_char(p.start_date, 'YYYY-MM-DD') as start_date,
    to_char(p.end_date, 'YYYY-MM-DD') as end_date
    
  FROM
    apad_sliceposition AS s
  JOIN
  apad_slicedparts AS p ON s.id = p.id
  JOIN
  apad_product AS pt ON s.drawing_number = pt.drawing_number
    where
    (p.start_date <= (SELECT end_date FROM apad_slicedparts WHERE id = $1)
    AND p.end_date >= (SELECT start_date FROM apad_slicedparts WHERE id = $1))
  `;
  
  pool.query(query,  [id],(error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows)
      console.log(result.rows);
    }
  });
});


app.get('/api/position', (req, res) => {
 
  const { start_date, end_date } = req.query;
  // Replace 'apad_assembly_area' with the actual name of your table
  const query = `SELECT
  s.id,
  p.slice_name,
  s.x,
  s.y,
  s.area_number,
  s.color,
  s.drawing_number,
  p.height,
  p.foot_length,
  p.foot_breadth,
  p.occ_length,
  p.occ_breadth,
  pt.customer_name,
  TO_CHAR(pt.inspection_date, 'YYYY-MM-DD') as inspection_date,
  TO_CHAR(p.start_date, 'YYYY-MM-DD') as start_date,
  TO_CHAR(p.end_date, 'YYYY-MM-DD') as end_date
FROM
apad_sliceposition AS s
JOIN
apad_slicedparts AS p ON s.id = p.id
JOIN
apad_product AS pt ON s.drawing_number = pt.drawing_number
WHERE
p.start_date::date <= $2
  AND
  p.end_date::date >= $1;`


  pool.query(query,   [start_date, end_date],(error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/bg', (req, res) => {
 
 
  // Replace 'apad_assembly_area' with the actual name of your table
  const query = `
  SELECT
    s.id,
    p.slice_name,
    s.x,
    s.y,
    s.area_number,
    s.color,
    s.drawing_number,
    p.height,
    p.foot_length,
    p.foot_breadth,
    p.occ_length,
    p.occ_breadth,
    pt.customer_name,
    to_char(pt.inspection_date, 'YYYY-MM-DD') as inspection_date,
    to_char(p.start_date, 'YYYY-MM-DD') as start_date,
    to_char(p.end_date, 'YYYY-MM-DD') as end_date
    
  FROM
  apad_sliceposition AS s
  JOIN
  apad_slicedparts AS p ON s.id = p.id
  JOIN
  apad_product AS pt ON s.drawing_number = pt.drawing_number
    
  `;
  
  pool.query(query,(error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows)
      
    }
  });
});





app.use(express.json());

app.delete('/api/tile/:id', (req, res) => {
  const { id } = req.params;

  // Perform the delete operation in the database
  pool.query('DELETE FROM apad_sliceposition WHERE id = $1', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'An error occurred while deleting the tile.' });
      return;
    }

    if (results.rowCount === 0) {
      res.status(404).json({ error: 'Tile not found.' });
    } else {
      res.status(200).json({ message: 'Tile deleted successfully.' });
    }
  });
});





//viewer set up
// Endpoint to handle authentication and return the access token
app.post('/authenticate', async (req, res) => {
  try {
    console.log("hello");
    // Perform the authentication logic here (e.g., using client ID and secret)
    const accessToken = await performAuthentication(clientId, clientSecret);

    // Send the access token as a JSON response
    res.json({ access_token: accessToken });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
});











//
//
//

//real time tracker
//
//
//
//


const blocknames=[];



app.get('/api/getPercentage/:sgid', async (req, res) => {
  try {
    const { sgid } = req.params;
    const query = 'SELECT "Percentage" FROM "apad_Customer" WHERE "ClientID" = $1';
    //console.log('sgid : ',sgid)
    const values = [sgid];
    const result = await pool.query(query,values);
    //console.log('result : ',result)
    const per = result.rows[0].Percentage
    if (result.rows.length > 0) {
      res.json({ percentage : per });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocksClient/:sgid', async (req, res) => {
  try {
    const { sgid } = req.params;
    console.log(sgid)
    const query = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" =(SELECT "OAN" FROM "apad_Customer" WHERE "ClientID"=$1) AND "Status" = $2';
    const result = await pool.query(query, [sgid, 'Placed']);
    const totalPlacedBlocks = result.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocksClient/:sgid', async (req, res) => {
  try {
    const { sgid } = req.params;
    const query = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" =(SELECT "OAN" FROM "apad_Customer" WHERE "ClientID"=$1)';
    const result = await pool.query(query, [sgid]);
    const totalPlacedBlocks = result.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// GET route to fetch user data
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT "UserID", "UserName", "UserType", "Status" FROM "apad_RT_User" ORDER BY "UserID"');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/datacustomer', async (req, res) => {
  try {
    const result = await pool.query('SELECT "ClientID", "ClientName", "OAN", "Percentage" FROM "apad_Customer" ORDER BY "ClientID"');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// POST route to add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { UserID, UserName, Role, Email, Password } = req.body;

    // Perform database insertion using the provided data
    await pool.query(
      'INSERT INTO "apad_RT_User" ("UserID", "UserName", "UserType", "UserEmail", "UserPassword", "LastLogin", "Status") VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)',
      [UserID, UserName, Role, Email, Password, 'INACTIVE']
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// POST route to add a new Client
app.post('/api/dataClient', async (req, res) => {
  try {
    const { ClientID, ClientName, OAN } = req.body;

    // Perform database insertion using the provided data
    await pool.query(
      'INSERT INTO "apad_Customer" ("ClientID", "ClientName", "OAN") VALUES ($1, $2, $3)',
      [ClientID, ClientName, OAN]
    );

    res.status(201).json({ message: 'Client created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating client' });
  }
});

//Update Status
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    //console.log(id,status)

    // Perform the status update operation using the user ID
    await pool.query('UPDATE "apad_RT_User" SET "Status" = $1 WHERE "UserID" = $2', [status, id]);

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

//To fetch user details for editing purpose
app.get('/api/users/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const query = {
      text: 'SELECT * FROM public."apad_RT_User" WHERE "UserID" = $1',
      values: [userID],
    };

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update edited User details
app.put('/api/dataEdit/:userID', async (req, res) => {
  const { userID } = req.params;
  const updatedUserData = req.body;

  try {
    // Construct the SQL query to update user data in the database
    const query = {
      text: `
        UPDATE "apad_RT_User"
        SET "UserName" = $1, "UserPassword" = $2, "UserEmail" = $3, "UserType" = $4
        WHERE "UserID" = $5
      `,
      values: [
        updatedUserData.UserName,
        updatedUserData.UserPassword,
        updatedUserData.UserEmail,
        updatedUserData.UserType,
        userID,
      ],
    };

    // Execute the query to update user data
    await pool.query(query);

    // Send a success response
    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    // Log and send an error response if an error occurs
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Failed to update user data' });
  }
});

// Delete User
app.delete('/api/dataDelete/:userID', async (req, res) => {
  const {userID} = req.params;
  try {
    // Delete the user from the database
    const result = await pool.query('DELETE FROM "apad_RT_User" WHERE "UserID" = $1', [userID]);
    
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//To fetch client details for editing purpose
app.get('/api/dataEditClient/:OAN', async (req, res) => {
  const { OAN } = req.params;
  try {
    const query = {
      text: 'SELECT * FROM public."apad_Customer" WHERE "OAN" = $1',
      values: [OAN],
    };

    const result = await pool.query(query);
    console.log(result.rows)
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update edited Client details
app.put('/api/dataEditCustomer/:OAN', async (req, res) => {
  const { OAN } = req.params;
  const updatedUserData = req.body;
  console.log(OAN)
  console.log(updatedUserData)

  try {
    // Construct the SQL query to update user data in the database
    const query = {
      text: `
        UPDATE "apad_Customer"
        SET "ClientID" = $1, "ClientName" = $2
        WHERE "OAN" = $3
      `,
      values: [
        updatedUserData.ClientID,
        updatedUserData.ClientName,
        OAN,
      ],
    };

    // Execute the query to update user data
    await pool.query(query);

    // Send a success response
    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    // Log and send an error response if an error occurs
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Failed to update user data' });
  }
});

// Delete Client
app.delete('/api/dataDeleteClient/:OAN', async (req, res) => {
  const {OAN} = req.params;
  console.log(OAN);
  try {
    // Delete the user from the database
    const result = await pool.query('DELETE FROM "apad_Customer" WHERE "OAN" = $1', [OAN]);
    
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new GET route to fetch the OAN with the maximum Percentage
app.get('/maxPercentageOAN', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" WHERE "Percentage" = (SELECT MAX("Percentage") FROM "apad_Customer")';
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ OAN: result.rows[0].OAN });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocks', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" WHERE "Percentage" = (SELECT MAX("Percentage") FROM "apad_Customer")';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1';
    const result2 = await pool.query(query2, [OA_No]);
    const totalRowCount = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalRowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocks', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" WHERE "Percentage" = (SELECT MAX("Percentage") FROM "apad_Customer")';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1 AND "Status" = $2';
    const result2 = await pool.query(query2, [OA_No, 'Placed']);
    const totalPlacedBlocks = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/maxPercentageOAN2', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 1';
    
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ OAN: result.rows[0].OAN });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocks2', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 1';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1';
    const result2 = await pool.query(query2, [OA_No]);
    const totalRowCount = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalRowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocks2', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 1';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1 AND "Status" = $2';
    const result2 = await pool.query(query2, [OA_No, 'Placed']);
    const totalPlacedBlocks = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


app.get('/maxPercentageOAN3', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 2';
    
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ OAN: result.rows[0].OAN });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/totalBlocks3', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 ';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1';
    const result2 = await pool.query(query2, [OA_No]);
    const totalRowCount = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ TB: totalRowCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/placedBlocks3', async (req, res) => {
  try {
    const query = 'SELECT "OAN" FROM "apad_Customer" ORDER BY "Percentage" DESC LIMIT 1 OFFSET 2';
    const result = await pool.query(query);
    const OA_No = result.rows[0].OAN

    const query2 = 'SELECT COUNT(*) AS total_count FROM "apad_Blocks" WHERE "OAN" = $1 AND "Status" = $2';
    const result2 = await pool.query(query2, [OA_No, 'Placed']);
    const totalPlacedBlocks = result2.rows[0].total_count;
    // Sending the total row count to the frontend
    res.json({ PB: totalPlacedBlocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});








app.get('/getTotalBlockCount', async (req, res) => {
  try {
    // Query to get the total block count for a specific "OAN" (e.g., 'OA1')
    const query = 'SELECT "RedNo" FROM "apad_Blocks" WHERE "OAN" = $1 ORDER BY "RedNo" ';
    const values = req.query.OAN; // Replace with the specific OAN you want to count
    //console.log(values);
    const result = await pool.query(query, [values]);
    const redNoValues = result.rows.map(row => row.RedNo);
    //console.log("hello",redNoValues);
    res.json({ redNoValues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching total block count' });
  }
});


app.get('/getBlockStatus', async (req, res) => {
  try {
    // Query to get the "status" for each block
    const query = 'SELECT "RedNo", "Status" FROM "apad_Blocks" WHERE "OAN" = $1 ORDER BY "RedNo"';
    const values = req.query.OAN; // Replace with the specific OAN you want to query

    const result = await pool.query(query, [values]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching block status' });
  }
});

// POST route to update MNo and TrNo in the Blocks table
app.post('/updateBlockAttributes', async (req, res) => {
  try {
    const { redNo, MNo, TrNo } = req.body;
    const OAN=req.query.OAN;

    // Update the MNo and TrNo attributes in the Blocks table
    const query = 'UPDATE "apad_Blocks" SET "MNo" = $1, "TrNo" = $2, "Status" = $3, "PlacementTime" = CURRENT_TIMESTAMP WHERE "OAN" = $4 AND "RedNo" = $5';
    const values = [MNo, TrNo, 'Placed', OAN, redNo]; // Assuming you want to set the Status to 'Placed'
    await pool.query(query, values);

    const childtrno = MNo.concat("/",TrNo);
    const dateObject = new Date();

    const query1 = 'UPDATE "assembly_transactions" SET "apad_status" = $1, "apad_updationtime" = $3 where "child_trace_no" = $2';
    const values1 = ['Placed',childtrno, dateObject]; // Assuming you want to set the Status to 'Placed'
    await pool.query(query1, values1);


    const placed = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1';
    const placedValue = [OAN]
    const tot = await pool.query(placed,placedValue)
    const totalBlocksforPercentage = tot.rows[0].count
    //console.log(totalBlocksforPercentage);

    const placed2 = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1 AND "Status"=$2';
    const placedValue2 = [OAN, 'Placed']
    const tot2 = await pool.query(placed2,placedValue2)
    const placedBlocksforPercentage = tot2.rows[0].count
    //console.log(placedBlocksforPercentage);

    const per = (placedBlocksforPercentage / totalBlocksforPercentage) * 100
    const percentageAsInteger = parseInt(per, 10);
    //console.log(per, ' ',percentageAsInteger)
    const updateQuery = 'UPDATE "apad_Customer" SET "Percentage" = $1 WHERE "OAN" = $2';
    const updateValues = [percentageAsInteger,OAN]
    await pool.query(updateQuery,updateValues)
  // Execute the query to calculate and update the percentage
  

    res.json({ message: 'Block attributes updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating block attributes' });
  }
});

// POST route to update MNo and TrNo attributes to null in the Blocks table
app.post('/rejectBlockAttributes', async (req, res) => {
  try {
    const { redNo, OAN } = req.body; // Get OAN from the request body
    //console.log("OAN :",OAN);

    // Update the MNo and TrNo attributes to null in the Blocks table
    const query = 'UPDATE "apad_Blocks" SET "MNo" = $1, "TrNo" = $2, "Status" = $3 WHERE "RedNo" = $4 AND "OAN" = $5';
    const values = [null, null, "NotPlaced", redNo, OAN]; 

    await pool.query(query, values);
    const placed = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1';
    const placedValue = [OAN]
    const tot = await pool.query(placed,placedValue)
    const totalBlocksforPercentage = tot.rows[0].count
    //console.log(totalBlocksforPercentage);

    const placed2 = 'SELECT COUNT(*) FROM "apad_Blocks" Where "OAN"=$1 AND "Status"=$2';
    const placedValue2 = [OAN, 'Placed']
    const tot2 = await pool.query(placed2,placedValue2)
    const placedBlocksforPercentage = tot2.rows[0].count
    //console.log(placedBlocksforPercentage);

    const per = (placedBlocksforPercentage / totalBlocksforPercentage) * 100
    const percentageAsInteger = parseInt(per, 10);
    //console.log(per, ' ',percentageAsInteger)
    const updateQuery = 'UPDATE "apad_Customer" SET "Percentage" = $1 WHERE "OAN" = $2';
    const updateValues = [percentageAsInteger,OAN]
    await pool.query(updateQuery,updateValues)
    res.json({ message: 'Block rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while rejecting block' });
  }
});



// POST route to get MNo and TrNo values for a specific redNo
app.post('/getBlockAttributes', async (req, res) => {
  try {
    const { redNo,OAN } = req.body;
    //console.log("OANs :",OAN);
    
    // Query the database to fetch MNo and TrNo for the specified redNo
    const query = 'SELECT "MNo", "TrNo" FROM "apad_Blocks" WHERE "RedNo" = $1 AND "OAN" = $2';
    const values = [redNo, OAN]; // Assuming 'OA1' is the OAN you are working with

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        MNo: result.rows[0].MNo,
        TrNo: result.rows[0].TrNo,
      });
    } else {
      res.json({
        success: false,
        error: 'Block not found for the specified RedNo and OAN',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching block attributes' });
  }
});

app.post('/upload_main', upload.single('file'), async (req, res) => {
  try {
    const { clientId, OANumber } = req.body;
    //console.log(clientId,OANumber);
    // Authenticate with Autodesk Forge
    const authData = new URLSearchParams();
    authData.append('client_id', CLIENT_ID);
    authData.append('client_secret', CLIENT_SECRET);
    authData.append('grant_type', 'client_credentials');
    authData.append('scope', 'data:write data:read bucket:read');

    const authResponse = await axios.post('https://developer.api.autodesk.com/authentication/v1/authenticate', authData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Set the correct content type
      },
    });

    const accessToken = authResponse.data.access_token;
  //console.log('OAN : ',OANumber);
  //console.log('clientid : ',clientId)
   const clientQuery = 'SELECT "UserName" FROM "apad_RT_User" WHERE "UserID" = $1';
   const re = await pool.query(clientQuery, [clientId]);
   //console.log('re : ',re)
   const clientname=re.rows[0].UserName;
    //console.log('clientname : ',clientname)
   const customerUpdateQuery = 'INSERT INTO "apad_Customer" ("OAN","ClientName", "ClientID") VALUES($1, $2,$3)';
   await pool.query(customerUpdateQuery, [OANumber, clientname,clientId]);


    // Upload the file to the existing bucket
    const file = req.file;
    const uploadResponse = await axios.put(`https://developer.api.autodesk.com/oss/v2/buckets/${BUCKET_KEY}/objects/${file.originalname}`, file.buffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': file.mimetype,
      },
    });

    //console.log(uploadResponse)
    if (uploadResponse.status === 200) {

      const objectURN = uploadResponse.data.objectId;
      const base64URN = Buffer.from(objectURN).toString('base64');
      //console.log("Base64 URN: " + base64URN);
      const dwg_urn =base64URN;
      const base_url = "https://developer.api.autodesk.com/modelderivative/v2/designdata";
      
      const metadata_response = await axios.get(`${base_url}/${dwg_urn}/metadata`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
  
      const metadata = metadata_response.data;
      // Step 2: Extract block information and identify the desired block
      for (const object_info of metadata.data.metadata) {
          if (object_info.name === '3D View') {
              const view_urn = object_info.guid;
              const view_response = await axios.get(`${base_url}/${dwg_urn}/metadata/${view_urn}`, {
                  headers: {
                      "Authorization": `Bearer ${accessToken}`
                  }
              });
              const view_metadata = view_response.data;
    
              // Now search through the view_metadata for the desired block
              for (const object_info_3d of view_metadata.data.objects[0].objects[0].objects) {
                  const block_details = object_info_3d.name.split(" ");
                  const block_name = block_details[0];
                  blocknames.push(block_name);
              }  
          }
      }
      //console.log(blocknames);
    
      // Insert each blockname as RedNo in the PostgreSQL "Blocks" table
    for (const blockname of blocknames) {
      const insertQuery = `INSERT INTO "apad_Blocks" ("OAN", "RedNo","Status") VALUES ($1, $2,$3)`;

      // Execute the query for each blockname
      await pool.query(insertQuery, [OANumber, blockname,"NotPlaced"]);
    }
      blocknames.splice(0, blocknames.length);
      res.send({ success: true, base64URN });
    } else {
      res.status(500).send({ success: false, error: 'Failed to upload the file' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
});


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { clientId, OANumber } = req.body;

    // Query to check if the customer exists
    const clientQuery = 'SELECT EXISTS(SELECT 1 FROM "apad_Customer" WHERE "OAN" = $1 AND "ClientID" = $2) as exists';
    const result = await pool.query(clientQuery, [OANumber, clientId]);
    const customerExists = result.rows[0].exists;

    // Immediately handle the case where the customer does not exist
    if (!customerExists) {
      return res.status(404).send({ success: false, message: 'Customer does not exist' });
    }
    // Authenticate with Autodesk Forge
    const authData = new URLSearchParams();
    authData.append('client_id', CLIENT_ID);
    authData.append('client_secret', CLIENT_SECRET);
    authData.append('grant_type', 'client_credentials');
    authData.append('scope', 'data:write data:read bucket:read');

    const authResponse = await axios.post('https://developer.api.autodesk.com/authentication/v1/authenticate', authData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Set the correct content type
      },
    });

    const accessToken = authResponse.data.access_token;
    
    // Upload the file to the existing bucket
    const file = req.file;
    const uploadResponse = await axios.put(`https://developer.api.autodesk.com/oss/v2/buckets/${BUCKET_KEY}/objects/${file.originalname}`, file.buffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': file.mimetype,
      },
    });

    //console.log(uploadResponse)
    if (uploadResponse.status === 200) {

      const objectURN = uploadResponse.data.objectId;
      const base64URN = Buffer.from(objectURN).toString('base64');
      //console.log("Base64 URN: " + base64URN);
      const dwg_urn =base64URN;
      const base_url = "https://developer.api.autodesk.com/modelderivative/v2/designdata";
      
      const metadata_response = await axios.get(`${base_url}/${dwg_urn}/metadata`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
  
      const metadata = metadata_response.data;
      // Step 2: Extract block information and identify the desired block
      for (const object_info of metadata.data.metadata) {
          if (object_info.name === '3D View') {
              const view_urn = object_info.guid;
              const view_response = await axios.get(`${base_url}/${dwg_urn}/metadata/${view_urn}`, {
                  headers: {
                      "Authorization": `Bearer ${accessToken}`
                  }
              });
              const view_metadata = view_response.data;
    
              // Now search through the view_metadata for the desired block
              for (const object_info_3d of view_metadata.data.objects[0].objects[0].objects) {
                  const block_details = object_info_3d.name.split(" ");
                  const block_name = block_details[0];
                  blocknames.push(block_name);
              }  
          }
      }
      //console.log(blocknames);
    
      // Insert each blockname as RedNo in the PostgreSQL "Blocks" table
    for (const blockname of blocknames) {
      const insertQuery = `INSERT INTO "apad_Blocks" ("OAN", "RedNo","Status") VALUES ($1, $2,$3)`;

      // Execute the query for each blockname
      await pool.query(insertQuery, [OANumber, blockname,"NotPlaced"]);
    }
      blocknames.splice(0, blocknames.length);
      res.send({ success: true, base64URN });
    } else {
      res.status(500).send({ success: false, error: 'Failed to upload the file' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
});




app.post('/login', async (req, res) => {
  const { sgid, password } = req.body;

  try {
    const query = {
      text: 'SELECT * FROM "apad_RT_User" WHERE "UserID" = $1 AND "UserPassword" = $2',
      values: [sgid, password],
    };
    const result = await pool.query(query);
    //console.log(result)
    if (result.rows.length === 1) {
      const userRole = result.rows[0].UserType
      const userStatus = result.rows[0].Status
      const lowercaseRole = userRole.toLowerCase();
      if (userStatus === 'ACTIVE'){
        if (lowercaseRole === 'viewer') {
          res.json({ success: true, message: 'Login successful', role: 'viewer' });
        } else if (lowercaseRole === 'supervisor') {
          res.json({ success: true, message: 'Login successful', role: 'supervisor' });
        } else if (lowercaseRole === 'admin') {
          res.json({ success: true, message: 'Login successful', role: 'admin' });
        } 
        else{
          res.json({ success: true, message: 'Login successful', role: 'Other' });
        }
      }
      else{
        res.json({ success: false, message: 'User is INACTIVE' });
      }
    } else {
      res.json({ success: false, message: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
