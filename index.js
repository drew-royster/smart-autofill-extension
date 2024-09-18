const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON
// Increase the limit to 10MB
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

// POST route to receive JSON
app.post('/data', (req, res) => {
  const receivedData = req.body;
  console.log('Received JSON:', receivedData);

  // Save the received data to a file
  fs.writeFile('receivedData.json', JSON.stringify(receivedData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      res.status(500).send('Error saving data');
    } else {
      res.send('JSON received and saved');
    }
  });

  res.send('JSON received');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
