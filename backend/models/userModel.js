const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        admin:Boolean,
    },
    DOB:{
        type:Number,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('User', userSchema);