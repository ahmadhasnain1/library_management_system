const UserModel = require('../models').User;
const BookModel = require('../models').Book;
const LibraryModel = require('../models').Library;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const emailJob = require('../jobs/sendEmail');

const login = async(req, res) => {
  try{
      email = req.body.email;
      const user = await UserModel.findOne({    // get user from database
        include: [{
          model: BookModel,
          as: 'userBooks',
        }],
        where: {email}
       });
    if (user && await(bcrypt.compareSync(req.body.password, user.password))) {  // check user found and verify password
          const token = jwt.sign(   // authentication successful
            { id: user.id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          user.token = token;   // save user token
          user.update({
            token: token
          });    
          res.status(200).json({"user":user});
    }
    else
        res.status(400).send("Invalid Credentials");
  } catch(e){
    res.status(500).json({error:e.message})
  }
}

const logout = async(req, res) => {
  try{
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    const user = await UserModel.findOne({ where:{id:req.user.id} });
    user.token = null;
    user.update({
      token: null
    });
    res.status(200).json({"message":"logged out successfully."});
  } catch(e){
    res.status(500).json({error:e.message})
  }
}

const getAllUsers = async(req, res) => {
    try{
        let users = await req.library.getUsers();        
        res.status(200).json({users:users});
    } catch(e){
      res.status(500).json({error:e.message})
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
          res.status(200).json({user:user});
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const createUser = async(req, res) => {
    try{
       let user = await UserModel.findOne({where:{email:req.body.email}});
       if(!user){
            user = await UserModel.create({
              full_name: req.body.full_name,
              email: req.body.email,
              password: req.body.password,
              token: null
            });
        }
        library = await LibraryModel.findOne({
          where: {
            id: req.body.library_id
          }
        });
        await library.addUser(user);
        emailJob.scheduleEmail(req.body.email, req.user.email, library.name, res);
        res.status(201).json({user:user});
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const updateUser = async(req, res) => {
    try{
        let object = {};
        if(req.body.full_name!=null)  object.full_name = req.body.full_name;
        if(req.body.email!=null)  object.email = req.body.email;
        if(req.body.password!=null)  object.password = req.body.password;
        await UserModel.update(object,{
          where: {
            id: req.body.user_id
          }
        });
        res.status(200).json({"message":'User updated successfully'});
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const deleteUser = async(req, res) => {
    try{
        let user = await UserModel.findOne({where:{id:req.body.user_id}});
        library = await LibraryModel.findOne({
          where: {
            id: req.body.library_id
          }
        });
        library.removeUser(user);
        res.send('User deleted successfully');
    } catch(e){
      res.status(500).json({error:e.message})
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