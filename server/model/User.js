const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    token:{
        type:String,
    },
    resetPassworExpiry:{
        type:Date,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"profile"
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"course",
        }
    ],
    image:{
        type:String,
        required:true,
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"courseProgress"
        }

    ]
    
},{ timestamps: true })
module.exports = mongoose.model("user",userSchema);
