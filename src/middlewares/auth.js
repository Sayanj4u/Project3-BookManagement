const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";

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
    const reqUserId = req.body.userId;
    const decodedId = decoded.userId;
    console.log(reqUserId);
    console.log(decodedId);
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
