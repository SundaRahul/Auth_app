const { required, string } = require('joi');
const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({

    username:{
        type: "string",
        required:true
    },
    name:{
        type:"string",
        required:true
    },
    email:{
        type:"string",
        required:true
    },
    password:{
        type:"string",
        required:true
    },
    gender:{
        type:"string",
    },
    DOB:{
        type:Date,
    },
    country:{
        type:"string"
    }

},{
    timestamps:true
});

const User=mongoose.model('User',UserSchema);

module.exports=User;