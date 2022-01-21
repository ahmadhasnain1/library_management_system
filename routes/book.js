var express = require('express');
var router = express.Router()
var userMiddleware = require('../middlewares/user');
var tokenMiddleware = require('../middlewares/token');
var adminMiddleware = require('../middlewares/admin');
var bookMiddleware = require('../middlewares/book');
const bookController = require('../controllers/Book');


/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - name
 *         - author
 *         - is_available
 *         - libraryId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The name of book
 *         author:
 *           type: string
 *           description: The author of book
 *         description:
 *           type: string
 *           description: The description of password
 *         publishing_date:
 *           type: date
 *           description: The publishing date of book
 *         is_available:
 *           type: boolean
 *           description: The availability of book
 *         userId:
 *           type: integer
 *           description: The user id of book
 *         libraryId:
 *           type: integer
 *           description: The library id of book
 *       example:
 *         id: 2
 *         name: Guliver's Travel
 *         author: Safeer Baig
 *         description: This is a book
 *         publishing_date: 20 January 2020
 *         is_avalable: true
 *         userId: null
 *         libraryId: 3
 */

 /**
  * @swagger
  * tags:
  *   name: Books
  *   description: The book managing API
  */

 /**
 * @swagger
 * /add:
 *   post:
 *     summary: Add a book in library
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The book name
 *         name: author
 *         schema:
 *           type: string
 *         required: true
 *         description: The book author 
 *         name: description
 *         schema:
 *           type: string
 *         required: false
 *         description: The book description 
 *         name: publishing_date
 *         schema:
 *           type: string
 *         required: false
 *         description: The book publishing date 
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of library in which book will be added 
 *     responses:
 *       201:
 *         description: The newly created book description
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       
 */
router.post('/add', tokenMiddleware.verifyToken, bookMiddleware.validateBookCreate, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdmin, adminMiddleware.checkAdminBelongsToLibrary, bookMiddleware.checkBookExistanceInLibrary,  bookController.addBook);

/**
 * @swagger
 * /remove:
 *   post:
 *     summary: Delete the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book id
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id from which book will be removed
 *     responses:
 *       200:
 *         description: The book is removed successfully from library
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.post('/remove', tokenMiddleware.verifyToken, bookMiddleware.validateBookDelete, userMiddleware.validateLibraryExistance, bookMiddleware.validateBookExistance, adminMiddleware.checkAdmin, adminMiddleware.checkAdminBelongsToLibrary,  bookController.deleteBook);

/**
 * @swagger
 * /update:
 *   post:
 *     summary: Update a book in library
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The book name
 *         name: author
 *         schema:
 *           type: string
 *         required: true
 *         description: The book author 
 *         name: description
 *         schema:
 *           type: string
 *         required: false
 *         description: The book description 
 *         name: publishing_date
 *         schema:
 *           type: string
 *         required: false
 *         description: The book publishing date 
 *         name: book_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of book that will be updated 
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of library in which book will be updated 
 *     responses:
 *       200:
 *         description: The book is updated successfully
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       
 */
router.post('/update', tokenMiddleware.verifyToken, bookMiddleware.validateBookUpdate, userMiddleware.validateLibraryExistance, bookMiddleware.validateBookExistance, adminMiddleware.checkAdmin, adminMiddleware.checkAdminBelongsToLibrary, bookMiddleware.checkBookExistanceInLibrary, bookController.updateBook);

/**
 * @swagger
 * /getAll:
 *   post:
 *     summary: Returns the list of all the books of a library
 *     tags: [Books]
 *      parameters:
 *       - in: path
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id from which the books will be returned
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.post('/getAll', tokenMiddleware.verifyToken, userMiddleware.validateLibraryExistance, bookController.getAllBooks);
router.get('/getOne/:book_id', tokenMiddleware.verifyToken, bookController.getBook);

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: Borrow a book from a library
 *     tags: [Books]
 *      parameters:
 *       - in: path
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id from which the book will be borrowed
 *         name: book_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id book which a user wants to borrow
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of user which wants to borrow a book
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.post('/borrow', tokenMiddleware.verifyToken, bookMiddleware.validateBookBorrow, userMiddleware.validateLibraryExistance, userMiddleware.checkUserBelongsToLibrary, bookMiddleware.validateBookExistance, bookController.borrowBook);

/**
 * @swagger
 * /return:
 *   post:
 *     summary: Return a book to a library
 *     tags: [Books]
 *      parameters:
 *       - in: path
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id to which the book will be returned
 *         name: book_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id book which a user wants to return
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of user which wants to return a book
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.post('/return', tokenMiddleware.verifyToken, bookMiddleware.validateBookReturn, userMiddleware.validateLibraryExistance, userMiddleware.checkUserBelongsToLibrary, bookMiddleware.validateBookExistance, bookController.returnBook);

module.exports = router