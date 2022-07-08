const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator")
const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");


const createBook = async function(req,res){

    let requestBody = req.body;

    // extract parameters
    const { title,excerpt,userId,ISBN,category,subcategory,releasedAt} = requestBody; //destructuring 

    if (!validator.isValid(title)) {
        return res.status(400).send({ status: false, message: "Title is required" });
    }
    if(!validator.isValidTitle(title)){
        return res.status(400).send({ status: false, message: "Invalid title" });
    }
    const titl = await bookModel.findOne({title:title})
    if(titl){
        return res.status(400).send({ status: false, message: "Title is already present" });
    }


    if (!validator.isValid(excerpt)) {
        return res.status(400).send({ status: false, message: "excerpt is required" });
    }


    if (!validator.isValid(userId)) {
        return res.status(400).send({ status: false, message: "userId is required" });
    }
   if(!mongoose.isValidObjectId(userId)){
    return res.status(400).send({ status: false, message: "userId is Invalid" });
   }
    const uId = await userModel.findById({_id:userId})
    if(!uId){
        return res.status(404).send({status:false, message:"no user found with this ID"})
    }

    if (!validator.isValid(ISBN)) {
        return res.status(400).send({ status: false, message: "ISBN is required" });
    }
    if(!validator.isValidIsbn(ISBN)){
        return res.status(400).send({status:false, message:"Invalid ISBN"})}
    const isbn = await bookModel.findOne({ISBN: ISBN})
    if(isbn){return res.status(400).send({status:false,message:"Duplicate ISBN"})}


    if (!validator.isValid(category)) {
        return res.status(400).send({ status: false, message: "category is required" });
    }

  console.log(typeof subcategory)
if(!validator.isValidSubcategory(subcategory)){return res.status(400).send({status:false, message:"subcategory must be string or array"})}
    if (!validator.isValid(releasedAt)) {
        return res.status(400).send({ status: false, message: "releasedAt is required" });
    }

    const book= await bookModel.create(requestBody)

    res.status(201).send({status:true,message: "Book created successfully",data:book})
}
const getBooks = async function(req,res){
    const query = req.query
  
if(query.userId==''){
    return res.status(400).send({status:false,message:"please enter userId "})
}
    const book = await bookModel.find({$and:[{isDeleted:false},query]}).sort({title:1}).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1})
    if(book.length===0){return res.status(404).send({status:false,message:"No Books Found"})}
    console.log(book.length)
    res.status(200).send({status:true,message:"Books list", data: book})
}

const getBooksById = async function(req,res){
    const bookId= req.params.bookId
    if(!mongoose.isValidObjectId(bookId)){
        return res.status(400).send({ status: false, message: "bookId is Invalid" });
       }
       const review =await reviewModel.find({bookId:bookId})

       console.log(review)
    const book = await bookModel.findById({_id:bookId})
    if(!book){ return res.status(404).send({status:false,message:"No such book found with this Id"})}
    const {_id,title,userId,category,subcategory,excerpt,isDeleted,reviews,releasedAt,createdAt,updatedAt} = book
    const data ={_id:_id,title:title,userId:userId,category:category,subcategory:subcategory,excerpt:excerpt,isDeleted:isDeleted,reviews:reviews,releasedAt:releasedAt,createdAt:createdAt,updatedAt:updatedAt,reviewsData:review}
    res.status(200).send({status:true,data:data})
}

const updateBookById = async function(req,res){
    const book = req.params.bookId
    const updateList = req.body
    
    if(Object.keys(updateList).length===0){return res.status(400).send({status:false, message:"Body can not be Empty"})}
    const updatedTitle = await bookModel.find({title:updateList.title})
    if(updatedTitle.length>0){ return res.status(400).send({status:false, message:"Title already present"})}
    
    const updateIsbn = await bookModel.find({ISBN:updateList.ISBN})
    if(updateIsbn.length>0){ return res.status(400).send({status:false, message:"ISBN already present"})}

    const updatedBook = await bookModel.findOneAndUpdate({_id:book},{$set:updateList},{new:true})
   
    res.status(200).send({status:true, data:updatedBook})
}

const deleteByBookId = async function(req,res){
    const book = req.params.bookId

    const deleteBook = await bookModel.findOneAndUpdate({_id:book},{$set:{isDeleted:true}},{new:true})
    res.status(200).send({status:true,data:deleteBook})


}




module.exports={createBook,getBooks,
    getBooksById,updateBookById,
    deleteByBookId};