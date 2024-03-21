const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.text());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Endpoint to retrieve log data
app.get('/getLogData', (req, res) => {
  fs.readFile(path.join(__dirname, 'log.txt'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const logLines = data.split('\n');
      const logData = [];

      logLines.forEach((line) => {
        const match = line.match(/DateTime: \[(.*?)\] Transaction Number: (.*?)\s+Output URL: (.*?)$/);
        if (match) {
          const timestamp = match[1];
          const transactionNumber = match[2];
          const outputUrl = match[3];

          const logEntry = {
            timestamp: timestamp,
            transactionNumber: transactionNumber,
            outputUrl: outputUrl,
          };
          logData.push(logEntry);
        }
      });

      res.json(logData);
    }
  });
});

// Endpoint to save log entries
// Endpoint to save log entries
// Endpoint to save log entries
app.post('/saveLog', (req, res) => {
    const logEntry = req.body;
  
    if (logEntry) {
      const now = new Date();
      const timestamp = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
      const logContent = `DateTime: [${timestamp}] ${logEntry}\n`;
  
      fs.appendFile(path.join(__dirname, 'log.txt'), logContent, (err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          console.log('Log saved successfully');
          res.sendStatus(200);
        }
      });
    } else {
      res.sendStatus(400);
    }
  });

app.listen(2424, () => {
  console.log('Server is running on port 2424');
});