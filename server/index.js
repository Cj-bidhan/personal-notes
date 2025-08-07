const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // ✅ Load .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({origin: '*'}));
app.use(express.json());

// ✅ Connect to MongoDB using the .env variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Notes API');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

