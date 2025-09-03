const mongoose = require("mongoose");

const verifiedEmailMSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

module.exports = mongoose.model("VerifiedEmail", verifiedEmailMSchema);