const mongoose = require("mongoose")

const isValidName = (name) => {
    if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name))
        return true
};

const isValidTitle = (title)=> {
    if(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(title))
    return true
}


///^[A-Za-z0-9_ -]*$/




const isValid = function(value) {
    if (typeof value !== "string" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const isValidSubcategory = function(subcategory) {
    if (typeof  subcategory !== "object") return false;
    if (typeof subcategory === "string" && subcategory.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0;
};
const isValidMobile = (mobile) => {
    if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile))
        return true
}
const isValidEmail = (email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
        return true
}
const isValidPassword = (password)=> {
    if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password))
    return true
}
const isValidIsbn = (ISBN)=> {
    if(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))
    return true
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports = {isValidName,isValid,isValidRequestBody,isValidEmail,isValidMobile,isValidPassword,isValidObjectId,isValidTitle,isValidIsbn,
    isValidSubcategory}
