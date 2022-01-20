var express = require('express');
var router = express.Router()
var userMiddleware = require('../middlewares/user');
var tokenMiddleware = require('../middlewares/token');
var adminMiddleware = require('../middlewares/admin');
var bookMiddleware = require('../middlewares/book');

const bookController = require('../controllers/Book');

router.post('/add', tokenMiddleware.verifyToken, bookMiddleware.validateBookCreate, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdmin, adminMiddleware.checkAdminBelongsToLibrary, bookMiddleware.checkBookExistanceInLibrary,  bookController.addBook);
router.post('/remove', tokenMiddleware.verifyToken, bookMiddleware.validateBookDelete, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdmin, adminMiddleware.checkAdminBelongsToLibrary, bookMiddleware.checkBookExistanceInLibrary,  bookController.deleteBook);
router.post('/update', tokenMiddleware.verifyToken, bookMiddleware.validateBookUpdate, bookMiddleware.validateBookExistance, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdmin, adminMiddleware.checkAdminBelongsToLibrary, bookMiddleware.checkBookExistanceInLibrary, bookController.updateBook);
router.post('/getAll', tokenMiddleware.verifyToken, userMiddleware.validateLibraryExistance, bookController.getAllBooks);
router.get('/getOne/:book_id', tokenMiddleware.verifyToken, bookController.getBook);
router.post('/borrow', tokenMiddleware.verifyToken, bookMiddleware.validateBookBorrow, userMiddleware.validateLibraryExistance,  bookController.borrowBook);
router.post('/return', tokenMiddleware.verifyToken, bookMiddleware.validateBookReturn, userMiddleware.validateLibraryExistance, bookController.returnBook);

module.exports = router