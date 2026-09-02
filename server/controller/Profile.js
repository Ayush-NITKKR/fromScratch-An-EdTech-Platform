const Profile = require("../model/Profile");
const User = require("../model/User");
const CourseProgress = require("../model/CourseProgress");
const { uploadImagetoCloudinary } = require("../utils/imageUploader");


exports.updateProfile = async (req ,res) => {
    try {
        // Get the data from Request
        const { firstName, lastName, dateofBirth = "", dateOfBirth = "", about = "", contactNumber = "", contact = "", gender = "" } = req.body;
        //get the userId from the req
        const userID = req.user.id;
        // validate the data
        if(!userID){
            return res.status(400).json({
                success:false,
                message:"User ID is missing"
            });
        }
        // Get the profile detail from the database
        const userDetail = await User.findById(userID);
        if(!userDetail){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        if (firstName) userDetail.firstName = firstName;
        if (lastName) userDetail.lastName = lastName;
        await userDetail.save();

        const profileId = userDetail.additionalDetails;
        let profileDetail = await Profile.findById(profileId);
        if (!profileDetail) {
            profileDetail = await Profile.create({
                gender: gender || null,
                dateofBirth: dateofBirth || dateOfBirth || null,
                about: about || null,
                contact: contactNumber || contact || null,
            });
            userDetail.additionalDetails = profileDetail._id;
            await userDetail.save();
        } else {
            if (dateofBirth || dateOfBirth) profileDetail.dateofBirth = dateofBirth || dateOfBirth;
            if (about !== undefined) profileDetail.about = about;
            if (gender) profileDetail.gender = gender;
            if (contactNumber || contact) profileDetail.contact = contactNumber || contact;
            await profileDetail.save();
        }

        const updatedUser = await User.findById(userID).populate("additionalDetails").exec();
        updatedUser.password = undefined;

        // return the response
        return res.status(200).json({
            success:true,
            message:"Profile is updated successfully",
            profileDetail,
            data: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || "Something went wrong while updating the profile"
        });
    }
}
exports.updateProfilePicture = async (req,res) => {
    try {
        const file = req.files?.image;

        if(!file){
            return res.status(404).json({
                success:false,
                message:"No image is given"
            })
        }

        // Validation of File
            
        const supportedExtension = ["jpg","png","jpeg","gif","svg","webp"];

        const ext = file.name.split(".").pop().toLowerCase();

        if(!supportedExtension.includes(ext)){
            return res.status(400).json({
                success:false,
                message:"Only supported extensions (jpg, png, jpeg, gif, svg, webp) are allowed"
            });
        }

        // Upload the file in cloudinary
        const response = await uploadImagetoCloudinary(file,process.env.FOLDER_NAME);

        // update the profile of user
        const userId = req.user.id;

        const updatedData = await User.findByIdAndUpdate(userId,{
            image:response.secure_url,
        },{
            new:true,
        }).populate("additionalDetails");

        updatedData.password = undefined;

        return res.status(200).json({
            success:true,
            message:"Updated successfully",
            data:updatedData
        }) 


        
    } catch (error) { 
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some thing went wrong"
        })
    }
}

//Delete the profile 
// Explain how can
exports.deleteAccount = async (req, res) => {
    try {
        //Get the Userid
        const userId = req.user.id;
        //check the id does it exist or not
        const userDetail = await User.findById(userId);
        if(!userDetail){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // if foudn then first delete the profile
        await Profile.findOneAndDelete({_id:userDetail.additionalDetails});

        // then delete the user
        await User.findOneAndDelete({_id:userId});

        //TODO: HW uneroll user from all enrolled courses


        // returne the response

        return res.status(200).json({
            success:true,
            message:"The account is deleted successfully"
        })
    } catch {
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        //Get the user detail
        const userId = req.user.id;
        //validate
        const userDetail = await User.findById(userId).populate("additionalDetails").exec();
        if(!userDetail){
            return res.status(404).json({
                success:false,
                message:"No user found"
            });
        }

        // send the response

        return res.status(200).json({
            success:true,
            message:"User data fetched Successfully",
            userDetail,
        });

    } catch {
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .populate("courseProgress")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }

      const coursesWithProgress = userDetails.courses.map((course) => {
        const courseObj = course.toObject();
        const totalLectures = courseObj.courseContent?.reduce(
          (count, section) => count + (section.subSection?.length || 0),
          0
        ) || 0;
        const progress = userDetails.courseProgress.find(
          (item) => item.courseID?.toString() === courseObj._id.toString()
        );
        const completedCount = progress?.completedVideos?.length || 0;
        courseObj.progressPercentage = totalLectures
          ? Math.round((completedCount / totalLectures) * 100)
          : 0;
        courseObj.completedVideos = progress?.completedVideos || [];
        return courseObj;
      });

      return res.status(200).json({
        success: true,
        data: coursesWithProgress,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    const userDetails = await User.findById(userId).populate("courseProgress");
    const progress = userDetails?.courseProgress?.find(
      (item) => item.courseID?.toString() === courseId
    );

    return res.status(200).json({
      success: true,
      data: progress || { courseID: courseId, completedVideos: [] },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not fetch course progress",
    });
  }
};

exports.updateCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, subSectionId } = req.body;

    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Course id and lecture id are required",
      });
    }

    let progress = await CourseProgress.findOne({ courseID: courseId, user: userId });
    const userDetails = await User.findById(userId);

    if (!userDetails?.courses?.some((item) => item.toString() === courseId)) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    if (!progress || !userDetails.courseProgress.some((item) => item.toString() === progress._id.toString())) {
      progress = await CourseProgress.create({
        user: userId,
        courseID: courseId,
        completedVideos: [],
      });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { courseProgress: progress._id },
      });
    }

    const alreadyCompleted = progress.completedVideos.some(
      (item) => item.toString() === subSectionId
    );

    progress = await CourseProgress.findByIdAndUpdate(
      progress._id,
      alreadyCompleted
        ? { $pull: { completedVideos: subSectionId } }
        : { $addToSet: { completedVideos: subSectionId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: alreadyCompleted ? "Lecture marked incomplete" : "Lecture marked complete",
      data: progress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Could not update course progress",
    });
  }
};
