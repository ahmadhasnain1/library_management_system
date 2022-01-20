const AdminModel = require('../models').Admin;
const LibraryModel = require('../models').Library;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const login = async(req, res) => {
    try{
        email = req.body.email;
        const admin = await AdminModel.findOne({   // get admin from database
          include: [{
            model: LibraryModel,
          }],
          email 
        });
        if (admin && await(bcrypt.compareSync(req.body.password, admin.password))) {   // check admin found and verify password
            const token = jwt.sign(    // authentication successful
                { admin_id: admin.id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
              admin.token = token;   // save admin token
              admin.update({
                token: token
              });
              res.status(200).json(admin);
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
    const admin = await AdminModel.findOne({ token });
    admin.token = null;
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

const update = async(req, res) => {
  try{
      let object = {};
      if(req.body.full_name!=null)  object.full_name = req.body.full_name;
      if(req.body.email!=null)  object.email = req.body.email;
      if(req.body.password!=null)  object.password = req.body.password;
      console.log(object);
      AdminModel.update(object,{
        where: {
          id: req.body.admin_id
        }
      });
      res.send('Admin info updated successfully');
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
    update
};