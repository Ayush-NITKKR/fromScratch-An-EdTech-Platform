const Course = require("../model/Course");
const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
const { deleteVideo } = require("../utils/fileDeletion");

//Create Section

//Fetch the data
//Validate the data
//Create the section
//Update the section in the course
//Return the response
exports.createSection = async (req, res) => {
    try {
        //Data fecth
        const {sectionName , courseId} = req.body;

        //Data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }
        //create the section
        const sectionObj = await Section.create({
            sectionName:sectionName
        })
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent:sectionObj._id
                }
            },
            {
               new: true,
            }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        //return the response 
        return res.status(200).json({
            success:true,
            message:"The section is added successfully",
            data: updatedCourse
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create the section",
            error:error.message
        })
    }
}
exports.updateSection = async (req, res) => {
    try {
        const {sectionName , sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }
        //Update the data
        await Section.findByIdAndUpdate(sectionId,{
            sectionName:sectionName
        })

        const updatedCourse = await Course.findOne({ courseContent: sectionId })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        // return the res
        return res.status(201).json({
            success:true,
            message:"The section is updated successfully",
            data: updatedCourse
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update the section",
            error:error.message
        })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        // get the data
        const {sectionId , courseId} = req.body;
        // validate the data
        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            }) 
        }
        // delete the data from db
        const section = await Section.findByIdAndDelete(sectionId);
        if(!section){
            return res.status(404).json({
                success:false,
                message:"The section is not found or it is already deleted"
            });
        }
        // also delete the subsectios of this section
        for(const subsectionId of section.subSection){
            const deletedSubsection = await SubSection.findByIdAndDelete(subsectionId);
            // also delete the video from cloudinary
            if(deletedSubsection?.videoPublicID) await deleteVideo(deletedSubsection.videoPublicID);
        }

        // pull the section from Course and return populated updated course
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $pull:{
                    courseContent:sectionId
                }
            },
            { new: true }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        // return the response
        return res.status(200).json({
            success:true,
            message:"the section is deleted successfully",
            data: updatedCourse
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete the section",
            error:error.message
        })
    }
}
