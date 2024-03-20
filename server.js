const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.text());

// Serve static files from the "public" directory
app.use(express.static('public'));

app.post('/saveLog', (req, res) => {
  const logEntry = req.body;

  if (logEntry) {
    const now = new Date();
    now.setHours(now.getHours() + 3); // Add 3 hours
    const logDatetime = now.toISOString();
    const fileName = 'log.txt';

    const logContent = `[${logDatetime}] ${logEntry}\n`; // Add a new line character

    fs.appendFile(fileName, logContent, (err) => {
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