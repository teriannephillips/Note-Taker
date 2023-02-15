const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /notes or /*'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
