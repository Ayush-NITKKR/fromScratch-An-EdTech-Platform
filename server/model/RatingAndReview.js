const mongoose =require("mongoose");

const ratingAndReview = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    rating:{
        type:Number,
        required:true,
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course",
        required: true,
    },
    review:{
        type:String,
        required:true,
    }
},{ timestamps: true })
module.exports = mongoose.model("ratingandreview",ratingAndReview);
