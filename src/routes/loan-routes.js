const express = require('express')
const router = new express.Router()
let Loan = require('../models/loan')





 /* const loan1 =  new Loan({
    book: "book1",
    ownerId: "1",
    userId: "1",
    reqDate: new Date(2021, 12, 21),
    start: new Date(2021, 12, 25),
    end: new Date(2022, 1, 25),
    accepted: false,
    current: false   
  })     
    
  loan1.save()
          .then(() => console.log('Loan added!'))
          .catch(() => console.log('Error: '))
  
   */ 



// lista di tutti i prestiti per libro
router.route('/loanlist/:book').get((req, res) => {
  Loan.find()
    .then(loans => res.json(loans.filter(function (loan) {
      return loan.book == req.params.book
    })))
    .catch(err => res.status(400).json('Error: ' + err))
})

// trova prestito per id
router.route('/:id').get((req, res) => {
  Loan.findById(req.params.id)
    .then(Loan => res.json(Loan))
    .catch(err => res.status(400).json('Error: ' + err))
})

// rimuovere elemento per id (da chiamare nel momento in cui il libro viene restituito, quando il propietario preme il bottone di restituzione)
router.route('/:id').delete((req, res) => {
  Loan.findByIdAndDelete(req.params.id)
    .then(() => res.json('Loan deleted.'))
    .catch(err => res.status(400).json('Error: ' + err))
})

// aggiornare tutti i campi per id (forse non serve)
router.route('/update/:id').post((req, res) => {
  Loan.findById(req.params.id)
    .then(Loan => {
        Loan.book = req.body.book
        Loan.ownerId = req.body.ownerId
        Loan.userId = req.body.userId
        Loan.reqDate = req.body.reqDate
        Loan.start = req.body.start
        Loan.end = req.body.end
        Loan.accepted = req.body.accepted 
        Loan.current = req.body.current
        //Loan.returned = req.body.returned

      Loan.save()
        .then(() => res.json('Loan updated!'))
        .catch(err => res.status(400).json('Error: ' + err))
    }).catch(err => res.status(400).json('Error: ' + err))
    
})

// aggiungere prestito (non solo dato user id e libro ma devo avere tutto, tranne i bool che li setto inizialmente a false (CHIEDERE A VICKY))
router.route('/add').post( (req, res) => {     
  const book = req.body.book;
  const ownerId = req.body.ownerId;
  const userId = req.body.userId;
  const reqDate = req.body.reqDate;
  
  // li ho dichiarati lo stesso anche se undefined perchè al costruttore devo passare i parametri in ordine
  const start=undefined;
  const end=undefined;
  // inizialmente a false, se il propietario accetta true, se il propietario rfiuta cancello il prestito
  const accepted = false;
  const current = false;
  //const returned = false;

  const newLoan = new Loan ({
    book,
    ownerId,
    userId,
    reqDate,
    start,
    end,
    accepted,
    current
   
  });

    newLoan.save().
    then( () =>res.json('Loan added!') ).catch( (err => res.status(400).json('Error: ' + err)) )
   
  } )
  

  //accettazione prestito

  router.route('/accept/:id').post((req, res) => {
    Loan.findById(req.params.id)
      .then(Loan => {          
          Loan.accepted = true;
          // è il proprietario che decide data di inizio (DA RIVEDERE GESTIONE CODA, ASSICURARSI CHE VENGANO RISPETTATI I TURNI)
          Loan.start = req.body.start;
          Loan.end = req.body.end;
          // cambiare data inizio con data corrente
          // data fine 30 giorni dopo?? 
        Loan.save()
          .then(() => res.json('Loan accepted!'))
          .catch(err => res.status(400).json('Error: ' + err))
      })
  })


  // prestito corrente (il libro è stato portato a casa da un utente)
  
  router.route('/current/:id').post((req, res) => {
    Loan.findById(req.params.id)
      .then(Loan => {          
          Loan.current = true;
        Loan.save()
          .then(() => res.json('Loan is current!'))
          .catch(err => res.status(400).json('Error: ' + err))
      })
  })

module.exports = router
