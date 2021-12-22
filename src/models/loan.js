const mongoose = require('mongoose')

const Schema = mongoose.Schema

const loanSchema = new Schema({
  book: { type: String, required: true, trim: true }, // trim => cancella spazi alla fine
  ownerId: { type: String, required: true, trim: true },
  userId: { type: String, required: true, trim: true },
  // data di richiesta del prestito da parte dell'utente
  reqDate: { type: Date, required: true, trim: true}, 
  // data di inizio del prestito, decisa dal proprietario (NON E' REQUIRED, INIZIALMENTE UNDEFINED, LA SETTO QUANDO VIENE ACCETTATO IL PRESTITO)
  start: { type: Date, trim: true },
  // data di fine del prestito, decisa dal proprietario  (NON E' REQUIRED, INIZIALMENTE UNDEFINED, LA SETTO QUANDO VIENE ACCETTATO IL PRESTITO)
  end: { type: Date, trim: true },  
  // se il prestito è stato accetto dal proprietario
  accepted: { type: Boolean, required: true , default: false }, 
  // se il prestito è quello corrente nella coda
  current: { type: Boolean, required: true , default: false},
  //returned: { type: Boolean, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

//loanSchema.index({ userId: 1, groupid: 1 })

mongoose.pluralize(null)
const model = mongoose.model('Loan', loanSchema)

module.exports = model
