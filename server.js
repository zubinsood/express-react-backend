///////////////////////////////
// Dependencies
////////////////////////////////
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
// create application object
const app = express();

///////////////////////////////
// Application Settings
////////////////////////////////
require('dotenv').config();

const { PORT = 3001, DATABASE_URI } = process.env;
///////////////////////////////
// Database Connection
////////////////////////////////
mongoose.connect(DATABASE_URI);
// Mongo connection Events
mongoose.connection
  .on('open', () => console.log('You are connected to MongoDB'))
  .on('close', () => console.log('You are disconnected from MongoDB'))
  .on('error', (error) => console.log(`MongoDB Error: ${error.message}`));

///////////////////////////////
// Models
////////////////////////////////
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
}, { timestamps: true });

const People = mongoose.model('People', PeopleSchema);

///////////////////////////////
// Mount Middleware
////////////////////////////////
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 

///////////////////////////////
// Mount Routes
////////////////////////////////

// create a test route
app.get('/', (req, res) => {
  res.send('hello world');
});

// Index Route
app.get('/people', async (req, res) => {
  try {
    res.status(200).json(await People.find({}));
  } catch (error) {
    res.status(400).json({ message: 'something went wrong' });
  }
});


// Create Route
app.post('/people', async (req, res) => {
  try {
    res.status(201).json(await People.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'something went wrong' });
  }
});

// Delete Route
app.delete('/people/:id', async (req, res) => {
  try {
    res.status(200).json(await People.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(400).json({ message: 'something went wrong' });
  }
})

// Update Route
app.put('/people/:id', async (req, res) => {
  try {
    res.status(200).json(
      await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json({ message: 'something went wrong' });
  }
});

///////////////////////////////
// Tell the app to listen
////////////////////////////////
app.listen(PORT, () => {
  console.log(`Express is listening on port: ${PORT}`);
});