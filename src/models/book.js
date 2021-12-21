const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
  author: { type: String, required: true, trim: true }, // trim => cancella spazi alla fine
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  userId: { type: String, required: true, trim: true }, // new vicky
  groupId: { type: String, required: true, trim: true }, // new vicky
  path: { type: String },
  thumbnail_path: { type: String },
  book_name_path: { type: String },
  book_name_thumbnail_path: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

bookSchema.index({ userId: 1, groupid: 1 })

mongoose.pluralize(null)
const model = mongoose.model('Book', bookSchema)

module.exports = model
