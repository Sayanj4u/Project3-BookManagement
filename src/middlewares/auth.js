const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";
const mongoose=require("mongoose")
const userModel = require("../models/userModel");


const loginCheck = async function (req, res, next) {
  try {

    let requestBody = req.body;
    
    if(Object.keys(requestBody).length===0){
        return res.status(400).send({status: false,message:"body couldnot be empty"})
     }

    let token = req.headers["x-api-key"] || req.headers["X-api-key"];
    if (!token) {
      return res
        .status(403)
        .send({ status: false, message: "token must be present" });
    }
    let decoded = jwt.verify(token, secretKey, { ignoreExpiration: true });

    if (Date.now() > decoded.exp * 1000) {
      return res
        .status(401)
        .send({ status: false, message: "token is expired" });
    }

    if(!mongoose.isValidObjectId(req.body.userId)){
        return res.status(400).send({ status: false, message: "userId is Invalid" });
       }
 const uId = await userModel.findById({_id:req.body.userId})
    if(!uId){
        return res.status(404).send({status:false, message:"no user found with this ID"})
    }

    if (req.body.userId !== decoded.userId) {
      return res
        .status(400)
        .send({ status: false, message: "Login user is different" });
    }
    next();
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message});
  }
};

module.exports = { loginCheck };
