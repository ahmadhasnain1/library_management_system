const UserModel = require('../models').User;
const BookModel = require('../models').Book;


const getAllBooks = async(req, res) => {
    try{
        books = await req.library.getBooks();        
        res.staus(200).json({books:books});
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }
  
  const getBook = async(req, res) => {
    try{
        const book = await BookModel.findOne({
          where: {
            id: req.params.book_id
          }
        });
        if (book === null) {
          res.status(404).json({ "error":'book not found against that id'});
        }
        else
          res.status(200).json({book:book});
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
          publishing_date: req.body.publishing_date,
          userId: null,
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
        if(req.body.publishing_date!=null) object.publishing_date = req.body.publishing_date;

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

  const borrowBook = async(req, res) => {
    try{
      BookModel.update({
        userId:req.user.id,
        is_avaliable:false
      },{
        where: {
          id: req.body.book_id
        }
      });
      res.send('Book borrowed successfully');
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }

  const returnBook = async(req, res) => {
    try{
      BookModel.update({
        userId:null,
        is_avaliable:true
      },{
        where: {
          id: req.body.book_id
        }
      });
      res.send('Book returned successfully');
    } catch(e){
      res.status(500).json({error:e.message})
    }
  }


  module.exports = {
    getAllBooks,
    getBook,
    addBook,
    deleteBook,
    updateBook,
    borrowBook,
    returnBook
};