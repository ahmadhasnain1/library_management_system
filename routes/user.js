var express = require('express');
var router = express.Router()
var userMiddleware = require('../middlewares/user');
var tokenMiddleware = require('../middlewares/token');
var adminMiddleware = require('../middlewares/admin');
const userController = require('../controllers/User');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         full_name:
 *           type: string
 *           description: The full_name of user
 *         email:
 *           type: string
 *           description: The email of user
 *         password:
 *           type: string
 *           description: The password of user
 *       example:
 *         id: 22
 *         full_name: Ahmad
 *         email: ahmad.hasnain@invozone.com
 *         password: 12%vsg3wyO*754$sad
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  */

 /**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: The user password 
 *     responses:
 *       200:
 *         description: The user description
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       
 */
router.post('/login', userMiddleware.validateUserLogin, userController.login);

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: full_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The user first name
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: The user password 
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id in which user will be added
 *     responses:
 *       201:
 *         description: The newly added user description
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The user is already added
 */
router.post('/add', tokenMiddleware.verifyToken, userMiddleware.validateUserCreate, adminMiddleware.checkAdmin, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdminBelongsToLibrary, userController.createUser);

/**
 * @swagger
 * /remove:
 *   post:
 *     summary: Delete the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id from which user will be removed
 *     responses:
 *       200:
 *         description: The user is removed successfully from library
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */
router.post('/remove', tokenMiddleware.verifyToken, userMiddleware.validateUserDelete, adminMiddleware.checkAdmin, userMiddleware.validateUserExistance, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdminBelongsToLibrary, userController.deleteUser);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: full_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The user full name
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: The user password 
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of user that will be updated
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id in which user exists
 *     responses:
 *       200:
 *         description: The user information updated successfully
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The user is already added with this email
 */
router.post('/update', tokenMiddleware.verifyToken, userMiddleware.validateUserUpdate, userMiddleware.validateUserEmail, userMiddleware.validateUserExistance, userMiddleware.validateLibraryExistance, userController.updateUser);


/**
 * @swagger
 * /getAll:
 *   post:
 *     summary: Returns the list of all the users of a library
 *     tags: [Users]
 *      parameters:
 *       - in: path
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id from which the users will be returned
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get('/getAll', tokenMiddleware.verifyToken, adminMiddleware.checkAdmin,  userMiddleware.validateLibraryExistance, adminMiddleware.checkAdminBelongsToLibrary, userController.getAllUsers);
router.get('/getOne/:user_id',  tokenMiddleware.verifyToken, adminMiddleware.checkAdmin, userController.getUser);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.post('/logout',  tokenMiddleware.verifyToken,  userController.logout);

module.exports = router