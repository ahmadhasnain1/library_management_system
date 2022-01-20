var express = require('express');
var router = express.Router()
var tokenMiddleware = require('../middlewares/token');
var adminMiddleware = require('../middlewares/admin');
const adminController = require('../controllers/Admin');

router.post('/login', adminMiddleware.validateAdminLogin,  adminController.login);
router.post('/update', tokenMiddleware.verifyToken, adminMiddleware.validateAdminUpdate, adminMiddleware.validateAdminExistance, adminController.update);

module.exports = router