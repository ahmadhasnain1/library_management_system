var express = require('express');
var router = express.Router()
var userMiddleware = require('../middlewares/user');
var tokenMiddleware = require('../middlewares/token');
var adminMiddleware = require('../middlewares/admin');
const userController = require('../controllers/User');

router.get('/', (req, res) => {
	res.send('Hello World!')
  });
router.post('/login', userMiddleware.validateUserLogin, userController.login);
router.post('/add', tokenMiddleware.verifyToken, userMiddleware.validateUserCreate, adminMiddleware.checkAdmin, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdminBelongsToLibrary, userMiddleware.validateUserEmail, userController.createUser);
router.post('/remove', tokenMiddleware.verifyToken, userMiddleware.validateUserDelete, adminMiddleware.checkAdmin, userMiddleware.validateUserExistance, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdminBelongsToLibrary, userController.deleteUser);
router.post('/update', tokenMiddleware.verifyToken, userMiddleware.validateUserUpdate, adminMiddleware.checkAdmin, userMiddleware.validateUserExistance, userMiddleware.validateLibraryExistance, adminMiddleware.checkAdminBelongsToLibrary, userController.updateUser);
router.get('/getAll', tokenMiddleware.verifyToken, adminMiddleware.checkAdmin, userController.getAllUsers);
router.get('/getOne/:user_id',  tokenMiddleware.verifyToken, adminMiddleware.checkAdmin, userController.getUser);

module.exports = router