const Course = require("../model/Course");
const Category = require("../model/Category");
const User = require("../model/User");
const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
require("../model/RatingAndReview");

const { uploadImagetoCloudinary}= require("../utils/imageUploader");

//CreateCourse Handler Functions

// Extract the data from body
// File fetch
// validate the data
// Validate the tag
// add course entry in tag
// add course in the (User)instructor
// upload to the clodinary
// 
exports.createCourse = async (req, res) => {
    try {
        //Fetch the data
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions,
        } = req.body;
        
        //get the thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !_tag || !thumbnail || !category){
            return res.status(400).json({
                success:false,
                message:"all feilds are required"
            })
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log(instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Details not found"
            })
        }

        //Check give tag is valid or not
        const categoryDetail = await Category.findById(category);

        if(!categoryDetail){
            return res.status(404).json({
                success:false,
                message:"Category are not found in the database"
            })
        }

        //Upload image in cloudinary
        const thumbnailImage = await uploadImagetoCloudinary(thumbnail, process.env.FOLDER_NAME);

        const tag = JSON.parse(_tag);
        const instructions = typeof _instructions === "string" ? JSON.parse(_instructions) : _instructions;

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            tag,
            thumbnail:thumbnailImage.secure_url,
            category,
            status: status || "Draft",
            instructions,
        })
        
        const categoryDetails2 = await Category.findOneAndUpdate(
            { _id: category },
            {
                $push: {
                    course: newCourse._id,
                },
            },
            {
                returnDocument: "after",
            }
        );

        console.log(categoryDetails2);

        //User ke courses me add karna h 
        await User.findByIdAndUpdate(
            userId,
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        );

        //return the response
        return res.status(200).json({
            success:true,
            message:"The course is created successfully",
            data: newCourse
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong in the Course creation"
        })
    }
}


//Get all courses handelr Functions

exports.showAllCourses = async (req, res) => {
    try {

        const Allcourses = await Course.find({},{courseName:true , 
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReview:true,
                                                studentEnrolled:true,
        }).populate("instructor")
        .exec();

        return res.status(200).json({
            success:true,
            message:"Data found successfully",
            data:Allcourses,
        })
        
    } catch (error) {
          console.error(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong in the Course creation"
        })
    }
}
//Get course details

exports.getCourseDetails = async (req, res) => {
    try {
        // Get the ID
        const {courseId} = req.body;
        //validate
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Course Id not valid"
            });
        }
        console.log("courseDetail");
        //find the course details
        const courseDetail = await Course.findById(courseId)
                            .populate({
                                path:"instructor",
                                populate:{
                                    path:"additionalDetails",
                                }
                            })
                            .populate("category")
                            .populate({
                                path:"ratingAndReview",
                                populate:{
                                    path:"user",
                                    select:"firstName lastName email image",
                                }
                            })
                            .populate({
                                path:"courseContent",
                                populate:{
                                    path:"subSection",
                                }
                            }).exec();
        // Validation

        if(!courseDetail){
            return res.status(404).json({
                success:false,
                message:`Could not find the course with ${courseId}`
            })
        }

        // return the response 

        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:courseDetail
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message,
        })
    }
}

exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // If Thumbnail Image is found, update it
        if (req.files && req.files.thumbnailImage !== undefined) {
            console.log("thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImagetoCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            course.thumbnail = thumbnailImage.secure_url;
        }

        // Update only the fields that are present in req.body (excluding courseId and thumbnailImage)
        for (const key in updates) {
            if (Object.prototype.hasOwnProperty.call(updates, key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key]);
                } else if (key !== "courseId" && key !== "thumbnailImage") {
                    course[key] = updates[key];
                }
            }
        }

        await course.save();

        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate({
                path: "ratingAndReview",
                populate: {
                    path: "user",
                    select: "firstName lastName email image",
                },
            })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Pull course from students enrolled
        const studentsEnrolled = course.studentEnrolled || [];
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            });
        }

        // Delete sections and subsections
        const courseContent = course.courseContent || [];
        for (const sectionId of courseContent) {
            const section = await Section.findById(sectionId);
            if (section) {
                const subSections = section.subSection || [];
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId);
                }
                await Section.findByIdAndDelete(sectionId);
            }
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
