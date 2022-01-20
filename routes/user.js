var express = require('express');
var router = express.Router()
var middleware = require('../middlewares/user');
const userController = require('../controllers/User');

router.get('/', (req, res) => {
	res.send('Hello World!')
  });
router.post('/login', userController.login);
router.post('/add', userController.createUser);
router.post('/remove', userController.deleteUser);
router.post('/update', userController.updateUser);
router.get('/getAll', userController.getAllUsers);
router.get('/getOne/:user_id', userController.getUser);

module.exports = router