const express = require("express");
const { auth, isAdmin, isInstructor, isStudent } = require("../middleware/Auth");
const { createCategory, showAllCategory , categoryPageDetails } = require("../controller/category");
const { createCourse, getCourseDetails, showAllCourses, editCourse, getInstructorCourses, deleteCourse } = require("../controller/course");
const { createSection, deleteSection, updateSection } = require("../controller/Section");
const { createSubsection, updatesubSection, deleteSubsection } = require("../controller/Subsection");
const { createRatingandReview, getAverageRating, getAllRating } = require("../controller/RatingAndReview");
const { getEnrolledCourses, getCourseProgress, updateCourseProgress } = require("../controller/Profile");
const routes = express.Router();


//course
routes.post('/createCourse',auth,isInstructor,createCourse);
routes.post('/editCourse',auth,isInstructor,editCourse);
routes.get('/getInstructorCourses',auth,isInstructor,getInstructorCourses);
routes.delete('/deleteCourse',auth,isInstructor,deleteCourse);
routes.post('/getCourseDetail',getCourseDetails);
routes.get('/showAllCourses', showAllCourses);


//section
routes.post('/addSection',auth,isInstructor,createSection);
routes.patch('/updateSection',auth,isInstructor,updateSection);
routes.delete('/deleteSection',auth,isInstructor,deleteSection);



//Subsections
routes.post('/addsubSection',auth,isInstructor,createSubsection);
routes.patch('/updatesubSection',auth,isInstructor,updatesubSection);
routes.delete('/deletesubSection',auth,isInstructor,deleteSubsection);
routes.post('/createRating', auth, createRatingandReview);
routes.post('/getAverageRating', getAverageRating);
routes.get('/getReviews', getAllRating);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
routes.post("/createCategory", auth, isAdmin, createCategory)
routes.get("/showAllCategories", showAllCategory)
routes.post("/getCategoryPageDetails", categoryPageDetails)

// Student

routes.get('/getEnrolledCourses',auth ,getEnrolledCourses);
routes.post('/getCourseProgress', auth, getCourseProgress);
routes.post('/updateCourseProgress', auth, updateCourseProgress);

module.exports = routes;
