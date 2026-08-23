const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateofBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true
    },
    contact:{
        type:String,
        trim:true,
    }

},{ timestamps: true })

module.exports = mongoose.model("profile",profileSchema)
