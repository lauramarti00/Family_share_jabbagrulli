const express = require('express')
const router = new express.Router()
let Book = require('../models/book')

// prendere tutti gli elementi
router.route('/list/:groupId').get((req, res) => {
  Book.find()// ritorna una lista di tutti gli elementi
    .then(books => res.json(books.filter(function(book) {
      return book.groupId == req.params.groupId
    })))// ritorna in json format
    .catch(err => res.status(400).json('Error: ' + err));
})

//lista libri del proprietario
router.route('/listperowner/:userId').get((req, res) => {
  Book.find()// ritorna una lista di tutti gli elementi
    .then(books => res.json(books.filter(function (book) {
      return (book.userId === req.params.userId)
    })))// ritorna in json format
    .catch(err => res.status(400).json('Error: ' + err))
})

// aggiungere elementi
/*
router.post('/add', (req, res, next) => {
  console.log(req.body)
  const author = req.body.author
  const title = req.body.title
  const description = req.body.description
  const userId = req.body.userId // new vicky
  const groupId = req.body.groupId // new vicky

  const newBook = new Book({
    author,
    title,
    description,
    userId, // new vicky
    groupId // new vicky
  })

  newBook.save()
    .then(() => res.json('Book added!'))
    .catch(err => res.status(400).json('Error: ' + err))
})
*/

// prendere elemento per id
router.route('/:id').get((req, res) => {
  Book.findById(req.params.id)
    .then(Book => res.json(Book))
    .catch(err => res.status(400).json('Error: ' + err))
})

// rimuovere elemento per id
router.route('/:id').delete((req, res) => {
  console.log('delete')
  Book.findById(req.params.id)
    .then(Book => {
      fr(path.join(__dirname, '../../images/books'), { files: Book.book_name_thumbnail_path })
      fr(path.join(__dirname, '../../images/books'), { files: Book.book_name_path })
    })
    .catch(err => res.status(400).json('Error: ' + err))
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.json('Book deleted.'))
    .catch(err => res.status(400).json('Error: ' + err))
})

// aggiornare per id
router.route('/update/:id').post((req, res) => {
  Book.findById(req.params.id)
    .then(Book => {
      Book.author = req.body.author
      Book.title = req.body.title
      Book.description = req.body.description
      Book.save()
        .then(() => res.json('Book updated!'))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

// test per salvare file e metterlo in cartella image
const sharp = require('sharp')
const multer = require('multer')
const fr = require('find-remove')
const path = require('path')

const bookStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../../images/books/'))
  },
  filename (req, file, cb) {
    fr(path.join(__dirname, '../../images/books'), { prefix: req.params.id })
    cb(null, `${req.params.id}-${Date.now()}.${file.mimetype.slice(file.mimetype.indexOf('/') + 1, file.mimetype.length)}`)
  }
})
const bookUpload = multer({ storage: bookStorage, limits: { fieldSize: 52428800 } })

router.post('/add', bookUpload.single('photo'), async (req, res, next) => {
  const {
    title, author, description, userId, groupId, image: imagePath
  } = req.body
  const { file } = req
  /* if (!(title && author && description)) {
    return res.status(400).send('Bad Request')
  } */
  // const user_id = req.params.id
  const book = {
    userId,
    title,
    author,
    description,
    groupId
  }
  if (file) {
    const fileName = file.filename.split('.')
    book.path = `/images/books/${file.filename}`
    book.book_name_path = `${file.filename}`
    book.thumbnail_path = `/images/books/${fileName[0]}_t.${fileName[1]}`
    book.book_name_thumbnail_path = `${fileName[0]}_t.${fileName[1]}`
    await sharp(path.join(__dirname, `../../images/books/${file.filename}`))
      .resize({
        height: 200,
        fit: sharp.fit.cover
      })
      .toFile(path.join(__dirname, `../../images/books/${fileName[0]}_t.${fileName[1]}`))
  } else {
    book.path = imagePath
    book.thumbnail_path = imagePath
  }
  console.log('BOOK FINALE')
  console.log(book)
  try {
    await Book.create(book)
    res.status(200).send('Book created!')
  } catch (error) {
    next(error)
  }
})

module.exports = router
