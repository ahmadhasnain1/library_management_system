var express = require('express');
var router = express.Router()
var middleware = require('../middlewares/admin');
const adminController = require('../controllers/admin');

router.post('/login', adminController.login);
router.post('/update', adminController.update);

module.exports = router