var express = require('express');
var router = express.Router()
var middleware = require('../middlewares/book');
const bookController = require('../controllers/Book');

router.post('/add', bookController.addBook);
router.post('/remove', bookController.deleteBook);
router.post('/update', bookController.updateBook);
router.post('/getAll', bookController.getAllBooks);
router.get('/getOne/:book_id', bookController.getBook);

module.exports = router