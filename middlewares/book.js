const Joi = require('joi');
const BookModel = require('../models').Book ;


const validateBookCreate = (req, res, next) => {
    try{
        const schema = Joi.object().keys({
          name: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),
          author: Joi.string().email().required(),
          description: Joi.string().min(2).max(255).optional(),
          publishing_date: Joi.date().optional(),
          library_id: Joi.integer().required()
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
          name: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).optional(),
          author: Joi.string().email().optional(),
          description: Joi.string().min(2).max(255).optional(),
          publishing_date: Joi.date().optional(),
          library_id: Joi.integer().required()
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
          book_id: Joi.integer().required(),
          library_id: Joi.integer().required()
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


 const validateBookExistance = (req, res, next) => {
    try{
        let book = BookModel.findOne({id:req.body.book_id});
        if(book){
            req.book = book;
            return next();
        }
        return res.status(400).json( { error: "Book does not exist with that id." });
    } catch(e){
        res.status(500).json({error:e.message})
    }
  }

  const checkBookExistanceInLibrary = (req, res, next) => {
    try{
      let book = BookModel.findOne({
        where: {
          [Op.and]: [
            { libraryId: req.body.library_id },
            { name: req.body.name },
            {author: req.body.author}
          ]
        }
      });
      if(book){
        return res.status(400).json( { error: "Book already exists inthis library." });
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
    checkBookExistanceInLibrary
}