const { default: mongoose } = require("mongoose");
const Course = require("../model/Course");
const RatingAndReview = require("../model/RatingAndReview");

//create rating and review
//Average rating and review
//Get all the rating and review

//create Rating and review

exports.createRatingandReview = async (req, res) => {
    try {
        // get the userId
        const userId = req.user.id;
        //get the course ID
        const { review, rating, courseId } = req.body;
        const numericRating = Number(rating);

        // validate the courseId
        if(!courseId || !numericRating || !review?.trim() || numericRating < 1 || numericRating > 5){
        return res.status(400).json({
            success:false,
            message:"Course, rating, and review are required"
        })
        }
        // check the user is enrolled or not
        const courseDetail = await Course.findOne({
            _id:courseId,
            studentEnrolled:{$elemMatch:{$eq: userId}}
        });

        if(!courseDetail){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course",
            });
        }
        // check wheather does this is already reviewed

        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            courseId
        });

        if(alreadyReviewed){
            alreadyReviewed.rating = numericRating;
            alreadyReviewed.review = review.trim();
            await alreadyReviewed.save();

            const updatedReview = await RatingAndReview.findById(alreadyReviewed._id)
                .populate("user", "firstName lastName email image");

            return res.status(200).json({
                success:true,
                message:"Rating and review updated successfully",
                data:updatedReview
            })
        };


        //entry
        const entry = await RatingAndReview.create({
                rating:numericRating,
                review:review.trim(),
                courseId,
                user:userId
        });
        //add the rating and review in the course

        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReview:entry._id
            }
        },
        {
            new:true
        });

        // return the respoonse

        const populatedEntry = await RatingAndReview.findById(entry._id)
            .populate("user", "firstName lastName email image");

        return res.status(200).json({
            success:true,
            message:"Rating and review is created successfully",
            data:populatedEntry
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server error try again ",
            error:error.message
        })
    }
}

// Average rating and review

exports.getAverageRating = async (req, res) => {
    try {
        const courseId = req.body.courseId || req.body.courseid;

        // validate the courseId

        const courseDetail = await Course.findById({_id:courseId}).
                                    populate("ratingAndReview");

        if(!courseDetail){
            return res.status(404).json({
                success:false,
                message:"Course does not exist"
            });
        }

        // calculate avg rating 

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    courseId: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{ $avg : "$rating"},
                }
            }
        ])

        // return rating

        if(result.length  > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }
        

        // if the course does not exist any rating then

        return res.status(200).json({
            success:true,
            message:"Average ragting is 0 , no rating given till now", 
            averageRating: 0
        });

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//. Get all the rating
//. 1 get the course Id from the fontend 
//. 2 populate the rating and review of all the user in the course

exports.getAllRating = async (req,res) => {
    try {
        const allReviews = await RatingAndReview.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                })
                                .populate({
                                    path:"courseId",
                                    select:"courseName",
                                })
        return res.status(200).json({
            success:true,
            message:"All review are retrived successfully",
            data:allReviews
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
