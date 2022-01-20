const UserModel = require('../models').User;
const BookModel = require('../models').Book;


const getAllBooks = async(req, res) => {
    try{
        books = await BookModel.findAll({
            include: [{
              model: UserModel,
            }],
          });
        res.send(books);
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const getBook = async(req, res) => {
    try{
        const book = await UserModel.findOne({
          where: {
            id: req.params.book_id
          }
        });
        if (book === null) {
          res.status(404).json({ "error":'book not found against that id'});
        }
        else
          res.send(book);
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const addBook = async(req, res) => {
    try{
       book = await BookModel.create({
          name: req.body.name,
          author: req.body.author,
          description: req.body.description,
          libraryId: req.body.library_id,
          userId: req.body.user_id,
          is_available: true
        })
        res.status(201).send(book);
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const updateBook = async(req, res) => {
    try{
        let object = {};
        if(req.body.name!=null)  object.name = req.body.name;
        if(req.body.author!=null)  object.author = req.body.author;
        if(req.body.description!=null)  object.description = req.body.description;
        if(req.body.is_available!=null)  object.is_available = req.body.is_available;
        console.log(object);
        BookModel.update(object,{
          where: {
            id: req.body.book_id
          }
        });
        res.send('Book updated successfully');
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const deleteBook = async(req, res) => {
    try{
        BookModel.destroy({
          where: {
            id: req.body.book_id
          }
        });
        res.send('Book deleted successfully');
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }

  module.exports = {
    getAllBooks,
    getBook,
    addBook,
    deleteBook,
    updateBook
};