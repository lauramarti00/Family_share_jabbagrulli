const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const bookSchema = new Schema({
  author: { type: String, required: true, trim:true}, // trim => cancella spazi alla fine
  title: { type: String, required: true, trim:true },
  description: { type: String, required: true }  
}, {
  timestamps: true, //automatic creaye fields
});

const model = mongoose.model('Book', bookSchema);

module.exports = model;