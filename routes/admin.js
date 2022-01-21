var express = require('express');
var router = express.Router()
var tokenMiddleware = require('../middlewares/token');
var adminMiddleware = require('../middlewares/admin');
const adminController = require('../controllers/Admin');

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *         - libraryId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the admin
 *         full_name:
 *           type: string
 *           description: The full_name of admin
 *         email:
 *           type: string
 *           description: The email of admin
 *         password:
 *           type: string
 *           description: The password of admin
 *       example:
 *         id: 2
 *         full_name: Saud Saleem
 *         email: saud.saleem@invozone.com
 *         password: 12%vsg3wyO*754$sad
 *         libraryId: 3
 */

 /**
  * @swagger
  * tags:
  *   name: Admins
  *   description: The admin managing API
  */

 /**
 * @swagger
 * /login:
 *   post:
 *     summary: Login an admin
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin email
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin password 
 *     responses:
 *       200:
 *         description: The admin description
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       
 */
router.post('/login', adminMiddleware.validateAdminLogin,  adminController.login);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Update an admin
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: full_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin full name
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin email
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin password 
 *         name: library_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The library id in which admin exists
 *     responses:
 *       200:
 *         description: The usadminer information updated successfully
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: The admin is already added with this email
 */
router.post('/update', tokenMiddleware.verifyToken, adminMiddleware.validateAdminUpdate, adminMiddleware.validateAdminEmail, adminMiddleware.validateAdminExistance, adminController.update);

module.exports = router