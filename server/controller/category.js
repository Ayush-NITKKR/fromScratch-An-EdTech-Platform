const  Category = require("../model/Category");
const Course = require("../model/Course");
const mongoose = require("mongoose");
//Create Category ka handler likhna h

// 1. Get the data from the body
// 2. validate the data
// 3.  update the db
// 4.  return the response

exports.createCategory = async (req, res) => {
    try {
        const {name , description } = req.body;

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }
        //create the entry in DB

        const CategoryDetail = await Category.create({
            name:name,
            description:description,
        });
        console.log(CategoryDetail);

        //Return the repsonse

        return res.status(200).json({
            success:true,
            message:"Category is created successfully"
        })

    } catch (error) {
        console.log(error.message);
        console.log("Error during create Category handler");
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}
//Get all the Categorys
exports.showAllCategory = async (req, res) => {
    try {
        const data =await Category.find({} , {name:true , description:true});

        res.status(200).json({
            success:true,
            message:"All category return successfully",
            data,
        })
        
    } catch (error) {
         console.log(error.message);
        console.log("Error during create Category handler");
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}
//categoryPageDetai
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: [
                    { path: "instructor" },
                    { path: "ratingAndReview" }
                ],
            })
            .exec();

        // Handle case when category is not found
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: [
                    { path: "instructor" },
                    { path: "ratingAndReview" }
                ],
            })
            .exec();
        
        let differentCategory = null;
        if (categoriesExceptSelected.length > 0) {
            const categoriesWithCourses = categoriesExceptSelected.filter(
                (cat) => cat.course && cat.course.length > 0
            );
            if (categoriesWithCourses.length > 0) {
                differentCategory = categoriesWithCourses[Math.floor(Math.random() * categoriesWithCourses.length)];
            } else {
                differentCategory = categoriesExceptSelected[Math.floor(Math.random() * categoriesExceptSelected.length)];
            }
        }

        // Get top selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: [
                    { path: "instructor" },
                    { path: "ratingAndReview" }
                ],
            })
            .exec();
        
        const allCourses = allCategories.flatMap((category) => category.course || []).filter(c => c);
        const mostSellingCourses = allCourses
            .sort((a, b) => {
                const aEnrolled = a.studentEnrolled ? a.studentEnrolled.length : 0;
                const bEnrolled = b.studentEnrolled ? b.studentEnrolled.length : 0;
                return bEnrolled - aEnrolled;
            })
            .slice(0, 10);

        // Keep original variable styles for backward compatibility
        const selectedCategoryCourses = selectedCategory;
        const differentCategories = differentCategory ? [differentCategory] : [];
        const topCourses = mostSellingCourses;

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
                selectedCategoryCourses,
                differentCategories,
                topCourses,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
