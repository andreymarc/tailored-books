const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI);

// Import and register User model
require('./models/User');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB database connection established successfully");
    
    // Passport configuration
    require('./config/passport')(passport);

    // Import routes
    const usersRouter = require('./routes/users');
    const childrenRouter = require('./routes/children');
    const storiesRouter = require('./routes/stories');

    // Use routes 
    app.use('/api/users', usersRouter);
    app.use('/api/children', childrenRouter);
    app.use('/api/stories', storiesRouter);

    // Serve static files from the React frontend app
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // API route
    app.get('/api', (req, res) => {
      res.json({ message: 'Hello from the Tailored Kids Books API!' });
    });

    // Anything that doesn't match the above, send back the index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection error: ", err);
    // Continue to start the server even if MongoDB connection fails
    app.get('/', (req, res) => {
      res.send('Server is running, but database connection failed.');
    });
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}, but database connection failed.`);
    });
  });