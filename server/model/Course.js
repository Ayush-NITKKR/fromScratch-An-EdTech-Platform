const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"section",
        }
    ],
    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ratingandreview",
        }
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tags",
        required: true,
    },
    studentEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
	instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
        default: "Draft",
	},
},{ timestamps: true });
module.exports = mongoose.model("course",CourseSchema);
