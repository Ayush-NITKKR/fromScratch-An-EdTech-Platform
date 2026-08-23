const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course",
        required:true,
    },
    completedVideos:[
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:"subsection",
        }
    ]
},{ timestamps: true })

courseProgress.index({ user: 1, courseID: 1 }, { unique: true });

module.exports = mongoose.model("courseProgress",courseProgress);
