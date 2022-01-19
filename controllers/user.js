const UserModel = require('../models').User;
const BookModel = require('../models').Book;

const login = async(req, res) => {
  try{
      // get admin from database
      email = req.body.email;
      const user = await UserModel.findOne({ email });

      // check admin found and verify password
    if (user && await(bcrypt.compareSync(req.body.password, user.password))) {
          // authentication failed
          const token = jwt.sign(
            { user: user.id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
    }
    else
        res.status(400).send("Invalid Credentials");
  }
  catch(e){
    if(!e.status) {
      res.status(500).json( { error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' } });
    } else {
        res.status(e.status).json( { error: { code: e.code, message: e.message } });
    }
  }
}

const logout = async(req, res) => {
  try{
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    const user = await UserModel.findOne({ token });
    user.token = null;
    res.status(200).json({"message":"logged out successfully."});
  }
  catch(e){
    if(!e.status) {
      res.status(500).json( { error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' } });
    } else {
        res.status(e.status).json( { error: { code: e.code, message: e.message } });
    }
  }

}

const getAllUsers = async(req, res) => {
    try{
        users = await UserModel.findAll({
            include: [{
              model: BookModel,
              as: 'userBooks',
            }],
          });
        res.send(users);
    }
    catch(e){
        if(!e.status) {
          res.status(500).json( { error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' } });
        } else {
            res.status(e.status).json( { error: { code: e.code, message: e.message } });
        }
    }
  }
  
  const getUser = async(req, res) => {
    try{
        const user = await UserModel.findOne({
          where: {
            id: req.params.user_id
          }
        });
        if (user === null) {
          res.status(404).json({ "error":'user not found against that id'});
        }
        else
          res.send(user);
    }
    catch(e){
        if(!e.status) {
          res.status(500).json( { error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' } });
        } else {
            res.status(e.status).json( { error: { code: e.code, message: e.message } });
        }
    }
  }
  
  const createUser = async(req, res) => {
    try{
       user = await UserModel.create({
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          email: req.body.email,
          password: req.body.password,
          token: null
        })
        res.status(201).send(user);
    }
    catch(e){
        if (e.name === 'SequelizeValidationError') {
          return res.status(400).json({
            success: false,
            msg: e.errors.map(err => err.message)
          })
        }
        else if(!e.status) {
          res.status(500).json( { error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' } });
        } else {
            res.status(e.status).json( { error: { code: e.code, message: e.message } });
        }
    }
  }
  
  const updateUser = async(req, res) => {
    try{
        let object = {};
        if(req.body.firstName!=null)  object.firstName = req.body.firstName;
        if(req.body.lastName!=null)  object.lastName = req.body.lastName;
        if(req.body.email!=null)  object.email = req.body.email;
        if(req.body.password!=null)  object.password = req.body.password;
        console.log(object);
        UserModel.update(object,{
          where: {
            id: req.body.user_id
          }
        });
        res.send('User updated successfully');
    }
    catch(e){
        if(!e.status) {
          res.status(500).json( { error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' } });
        } else {
            res.status(e.status).json( { error: { code: e.code, message: e.message } });
        }
    }
  }
  
  const deleteUser = async(req, res) => {
    try{
        UserModel.destroy({
          where: {
            id: req.body.user_id
          }
        });
        res.send('User deleted successfully');
    }
    catch(e){
        if(!e.status) {
          res.status(500).json( { error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred.' } });
        } else {
            res.status(e.status).json( { error: { code: e.code, message: e.message } });
        }
    }
  }

  module.exports = {
    login,
    logout,
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};