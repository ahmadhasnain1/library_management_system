const Joi = require('joi');
const AdminModel = require('../models').Admin ;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const validateAdminLogin = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          email: Joi.string().email().required(),
          password: Joi.string().min(5).max(30).required()
        });
        const result = schema.validate(req.body); 
        if(result.error == null)  //means valid
          next();
        else
          return res.status(400).json({
          success: false,
          msg: result.error.details.map(i => i.message).join(',')})
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const validateAdminUpdate = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          full_name: Joi.string().regex(/^[a-zA-Z ]*$/).min(3).max(30).optional(),
          email: Joi.string().email().optional(),
          password: Joi.string().min(5).max(30).optional(),
          admin_id: Joi.number().required()
        });
        const result = schema.validate(req.body); 
        if(result.error == null)  //means valid
          next();
        else
          return res.status(400).json({
          success: false,
          msg: result.error.details.map(i => i.message).join(',')})
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const validateAdminExistance = (req, res, next) => {
    try{
        let admin = AdminModel.findOne({where:{id:req.body.admin_id}});
        if(admin && req.user.id==req.body.admin_id){
            return next();
        }
        return res.status(400).json( { error: "Admin does not exist with that id." });
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const checkAdmin = async(req, res, next) => {
    try{
      let admin = await AdminModel.findOne({
        where:{
          [Op.and]: [
            { id: req.user.id },
            { email: req.user.email },
          ]
        }      
      });
      if(admin){
        req.admin=admin;
        return next()
      }
      return res.status(403).json( { error: "You donot have permission." });
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const checkAdminBelongsToLibrary = (req, res, next) => {
    try{
        if(req.admin.libraryId==req.body.library_id)
          return next()
        return res.status(403).json( { error: "You donot have permission." });
      } catch(e){
          res.status(500).json({error:e.message})
      }
  }
  const validateAdminEmail = async(req, res, next) => {
    try{
        if(req.body.email!=null){
            let admin = await AdminModel.findOne({where:{email:req.body.email}});
            if(admin){
                return res.status(400).json( { error: "Admin with that email already exists" });
            }
        }
        next();
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }
  module.exports = {
      validateAdminLogin,
      validateAdminUpdate,
      validateAdminExistance,
      checkAdmin,
      checkAdminBelongsToLibrary,
      validateAdminEmail
  }