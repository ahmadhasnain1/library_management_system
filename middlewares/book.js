const Joi = require('joi');
const BookModel = require('../models').Book ;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const validateBookCreate = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          name: Joi.string().regex(/^[a-zA-Z ]*$/).min(3).max(30).required(),
          author: Joi.string().regex(/^[a-zA-Z ]*$/).min(3).max(30).required(),
          description: Joi.string().min(2).max(255).optional(),
          publishing_date: Joi.date().optional(),
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

  const validateBookUpdate = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          name: Joi.string().regex(/^[a-zA-Z ]*$/).min(3).max(30).optional(),
          author: Joi.string().email().optional(),
          description: Joi.string().min(2).max(255).optional(),
          publishing_date: Joi.date().optional(),
          book_id: Joi.number().required(),
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

  const validateBookDelete = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          book_id: Joi.number().required(),
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

  const validateBookGetAll = (req, res, next) => {
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

  const validateBookBorrow = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          book_id: Joi.number().required(),
          library_id: Joi.number().required(),
          user_id: Joi.number().required()
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

  const validateBookReturn = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          book_id: Joi.number().required(),
          library_id: Joi.number().required(),
          user_id: Joi.number().required()
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


 const validateBookExistance = async(req, res, next) => {
    try{
        let book = await BookModel.findOne({
          where:{
            [Op.and]: [
              {id:req.body.book_id},
              {libraryId: req.body.library_id }
            ]
          }
        });
        if(book){
            req.book = book;
            return next();
        }
        console.log("validateBookExistance");
        return res.status(404).json( { error: "Book does not exist with that id." });
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const checkBookExistanceInLibrary = async(req, res, next) => {
    try{
      let book = await BookModel.findOne({
        where: {
          [Op.and]: [
            { libraryId: req.body.library_id },
            { name: req.body.name },
            {author: req.body.author}
          ]
        }
      });
      console.log(book);
      if(book){
        return res.status(400).json( { error: "Book already exists in this library." });
      }
      next();
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }


  module.exports = {
    validateBookCreate,
    validateBookExistance,
    validateBookUpdate,
    validateBookDelete,
    checkBookExistanceInLibrary,
    validateBookBorrow,
    validateBookReturn,
    validateBookGetAll
}