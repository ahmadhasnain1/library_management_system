const Joi = require('joi');
const UserModel = require('../models').User;
const LibraryModel = require('../models').Library;

const validateUserLogin = (req, res, next) => {
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

const validateUserCreate = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          full_name: Joi.string().regex(/^[a-zA-Z ]*$/).min(3).max(30).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(5).max(30).required(),
          library_id: Joi.number().required()
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

  const validateUserUpdate = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          full_name: Joi.string().regex(/^[a-zA-Z ]*$/).min(3).max(30).optional(),
          email: Joi.string().email().optional(),
          password: Joi.string().min(5).max(30).optional(),
          user_id: Joi.number().required(),
          library_id: Joi.number().required()
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

  const validateUserDelete = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          user_id: Joi.number().required(),
          library_id: Joi.number().required()
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

  const validateUserGetAll = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          library_id: Joi.number().required()
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

  const validateUserEmail = async(req, res, next) => {
    try{
        if(req.body.email!=null){
            let user = await UserModel.findOne({where:{email:req.body.email}});
            if(user){
                return res.status(400).json( { error: "User with that email already exists" });
            }
        }
        next();
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const validateLibraryExistance = async(req, res, next) => {
    try{
        let library = await LibraryModel.findOne({where:{id:req.body.library_id}});
        if(library){
            req.library = library;
            return next();
        }
        return res.status(400).json( { error: "Library does not exist with that id." });
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const validateUserExistance = async(req, res, next) => {
    try{
        let user = await UserModel.findOne({where:{id:req.body.user_id}});
        if(user){
            return next();
        }
        return res.status(404).json( { error: "User does not exist with that id." });
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const checkUserBelongsToLibrary = async(req, res, next) => {
    try{
      let user = await UserModel.findOne({where:{id:req.user.id}});
      if(await req.library.hasUser(user))
        return next()
      return res.status(400).json( { error: "User does not belongs to library." });
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }

  module.exports = {
      validateUserCreate,
      validateUserUpdate,
      validateUserDelete,
      validateUserLogin,
      validateUserEmail,
      validateUserExistance,
      validateLibraryExistance,
      validateUserGetAll,
      checkUserBelongsToLibrary
  }