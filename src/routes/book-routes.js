const express = require('express');
const router = new express.Router();
let Book = require('../models/book');

//prendere tutti gli elementi
router.route('/').get((req, res) => {
  Book.find()//ritorna una lista di tutti gli elementi
    .then(books => res.json(books))//ritorna in json format
    .catch(err => res.status(400).json('Error: ' + err));
});

//aggiungere elementi
router.post('/add', (req, res, next) => {

  console.log(req.body);
  const author = req.body.author;
  const title = req.body.title;
  const description = req.body.description;  

  const newBook = new Book({
    author,
    title,
    description    
  });

  newBook.save()
  .then(() => res.json('Book added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});


//prendere elemento per id
router.route('/:id').get((req, res) => {
  Book.findById(req.params.id)
    .then(Book => res.json(Book))
    .catch(err => res.status(400).json('Error: ' + err));
});

//rimuovere elemento per id
router.route('/:id').delete((req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.json('Book deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//aggiornare per id
router.route('/update/:id').post((req, res) => {
  Book.findById(req.params.id)
    .then(Book => {
      Book.author = req.body.author;
      Book.title = req.body.title;
      Book.description = req.body.description;    
      
      Book.save()
        .then(() => res.json('Book updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;