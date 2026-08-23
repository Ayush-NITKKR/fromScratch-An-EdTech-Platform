const mongoose = require("mongoose");

const SubSectionSchema = mongoose.Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
    videoPublicID:{
        type:String,
    }
},{ timestamps: true })
module.exports = mongoose.model("subsection",SubSectionSchema);
