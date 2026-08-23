const Subsection = require("../model/SubSection");
const Section = require("../model/Section");
const Course = require("../model/Course");
const { uploadImagetoCloudinary } = require("../utils/imageUploader");
const { deleteVideo } = require("../utils/fileDeletion");
require("dotenv").config();

exports.createSubsection = async (req, res) => {
    try {
        const { title, timeDuration, discription, description, sectionId } = req.body;
        const video = req.files?.video;
        const sectionDescription = description || discription;
        
        if(!title || !timeDuration || !sectionDescription || !sectionId || !video){
            return res.status(400).json({
                success:false,
                message:"All feilds should we filled"
            })
        }
        
        const videoUploded = await uploadImagetoCloudinary(video, process.env.FOLDER_NAME);
        
        const createSubSection = await Subsection.create({
            title,
            timeDuration,
            description:sectionDescription,
            videoUrl:videoUploded.secure_url,
            videoPublicID:videoUploded.public_id
        })
        
        await Section.findByIdAndUpdate(sectionId, {
            $push:{
                subSection:createSubSection._id,
            }
        }, { new: true });

        const updatedCourse = await Course.findOne({ courseContent: sectionId })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        return res.status(200).json({
            success:true,
            message:"subsection created successfully",
            data: updatedCourse
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"something went wrong in creating the Subsection",
            error:error.message
        })
    }
}

exports.updatesubSection = async (req, res) => {
    try {
        const { title, discription, description, timeDuration, subSectionId, sectionId } = req.body;
        const sectionDescription = description || discription;
        
        if(!title || !sectionDescription || !timeDuration || !subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All feilds are required",
            })
        }
        
        await Subsection.findByIdAndUpdate(subSectionId, {
            title,
            timeDuration,
            description:sectionDescription,
        }, { returnDocument: "after" });

        const updatedCourse = await Course.findOne({ courseContent: sectionId })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        return res.status(201).json({
            success:true,
            message:"This subsection is updated",
            data: updatedCourse
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:error.message
        });
    }
}

exports.deleteSubsection = async (req, res) => {
    try {
        const { sectionId, subSectionId } = req.body;
        
        if(!sectionId || !subSectionId){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }
        
        const subSectiondetial = await Subsection.findByIdAndDelete(subSectionId);
        if(!subSectiondetial){
            return res.status(400).json({
                success:false,
                message:"subsection is not found in the database"
            })
        }
        
        if(subSectiondetial.videoPublicID) {
            await deleteVideo(subSectiondetial.videoPublicID);
        }

        await Section.findByIdAndUpdate(sectionId, {
            $pull:{
                subSection:subSectionId,
            }
        });

        const updatedCourse = await Course.findOne({ courseContent: sectionId })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        return res.status(200).json({
            success:true,
            message:"Subsectioon is deleted successfully",
            data: updatedCourse
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:error.message
        });  
    }
}
