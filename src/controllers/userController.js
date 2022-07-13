const userModel = require("../models/userModel");
const secretKey = "Functionup-Radon";
const jwt = require("jsonwebtoken");
const validator = require("../validator/validator");

//*-----------------------------------User Creation----------------------------------------------------------------

const createUser = async function (req, res) {
  try {
    let requestBody = req.body;

    //# Extract parameters

    const { title, name, email, phone, password, address } = requestBody; //destructuring

    // **Validation starts**

    // title validation

    if (!validator.isValid(title)) {
      return res
        .status(400)
        .send({ status: false, messege: "Title is required" });
    }
    const tit = ["Mr", "Mrs", "Miss"];
    if (!tit.includes(title)) {
      return res
        .status(400)
        .send({ status: false, message: `title must be ${tit}` });
    }

    // name  Validation

    if (!validator.isValid(name)) {
      return res
        .status(400)
        .send({ status: false, messege: "Name is required" });
    }
    if (!validator.isValidName(name)) {
      return res.status(400).send({ status: false, messege: "Invalid Name" });
    }
    name.trim();

    //phone Validation

    if (!validator.isValid(phone)) {
      return res.status(400).send({
        status: false,
        message: "phone number is required and must be in string",
      });
    }
    if (!validator.isValidMobile(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid mobile number" });
    }

    //phone unique check

    const mobile = await userModel.findOne({ phone: phone });
    if (mobile) {
      return res.status(400).send({
        status: false,
        message: ` mobile number ${phone} is already registered`,
      });
    }

    // email Validation

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }
    if (typeof email === "string") {
      var Email = email.trim(email);
    }
    if (!validator.isValidEmail(Email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is invalid" });
    }

    // email unique check

    const mail = await userModel.findOne({ email: email });
    if (mail) {
      return res.status(400).send({
        status: false,
        message: `email ${email} is already registered`,
      });
    }

    //Password Validation

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!validator.isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password must contains min 8 chracters, max 15 characters Atleast one UpperCase and a number ",
      });
    }

    //Address Validation

    if (address) {
      const { street, city, pincode } = requestBody.address;
      if (!/^(?=.*?[a-zA-Z])[a-zA-Z\d ]+$/.test(street)) {
        //street validation
        return res.status(400).send({
          status: false,
          message: " enter valid street in alphabets only ",
        });
      }
      if (!/^([a-zA-Z ]+)$/.test(city)) {
        //city validation
        return res.status(400).send({
          status: false,
          message: " enter valid city in alphabets only ",
        });
      }
      if (!/^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(pincode)) {
        //pincode validation
        return res.status(400).send({
          status: false,
          message: " enter valid pincode in number only ",
        });
      }
    }


//*-----------------------------------**Validation Ends**----------------------------------------------------------------


    const registerUser = await userModel.create(requestBody);
    res
      .status(201)
      .send({ status: true, message: "Success", data: registerUser });
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};



//*-----------------------------------**User Login**----------------------------------------------------------------

const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body; //destructioring

    //Email Validation

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email id is required" });
    }

    if (!validator.isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Valid email id required" });
    }

    //Password validation

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res
        .status(401)
        .send({ status: false, message: "Incorrect email Id" });
    }
    if (findUser.password !== req.body.password) {
      return res
        .status(401)
        .send({ status: false, message: "Incorrect password" });
    }

    //Token Generation

    var token = jwt.sign({ userId: findUser._id.toString() }, secretKey, {
      expiresIn: "365d", // token expire date
    });

    req.header("x-api-key", token); //setting headers
    return res
      .status(200)
      .send({ status: true, message: "login successfully", data:{token: token} });
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};
module.exports = { createUser, loginUser };
