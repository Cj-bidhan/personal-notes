// server/models/note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,         // Title is mandatory
  },
  content: {
    type: String,
  },
}, {
  timestamps: true           // Automatically add createdAt and updatedAt fields
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
