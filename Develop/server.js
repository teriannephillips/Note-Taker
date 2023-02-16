const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /notes or /*'));

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'))
  console.info(`${req.method} request received to pull notes`);

})
app.post('/api/notes', (req, res) => {
  // Read the existing notes from the db.json file
  const filePath = path.join(__dirname, 'db/db.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading notes file');
      return;
    }

    // Parse the JSON data from the file into an array of note objects
    const notes = JSON.parse(data);

    // Add the new note object to the array
    const newNote = { id: Date.now(), ...req.body };
    notes.push(newNote);

    // Write the updated array back to the db.json file
    const newData = JSON.stringify(notes, null, 2);
    fs.writeFile(filePath, newData, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving note');
        return;
      }
      // Send a response back to the client to indicate that the note was saved successfully
      res.status(201).json(newNote);
    });
  });
});
    // API DELETE request
    app.delete("/api/notes/:id", (req, res) => {

      // Fetched id to delete
      let noteId = req.params.id.toString();
      
      console.log(`DELETE note request for noteId: ${noteId}`);

      // Read data from 'db.json' file
      // let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
      const filePath = path.join(__dirname, 'db/db.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading notes file');
      return;
    }

    // Parse the JSON data from the file into an array of note objects
    const notes = JSON.parse(data);
    for (i = 0; i < notes.length; i++ ) {

      if (notes[i].id == noteId) {
        notes.splice(i,1)
      }
    }
      // Write notes data back to the 'db.json' file
      fs.writeFileSync('./db/db.json', JSON.stringify(notes));
      
      console.log(`Successfully deleted note id : ${noteId}`);

      //Send response
      res.json(data);
  });
});
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
app.get('/notetaker.JPG', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/assets/images/notetaker.JPG'))
);

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`server is running at http://localhost:${PORT}`)
);
