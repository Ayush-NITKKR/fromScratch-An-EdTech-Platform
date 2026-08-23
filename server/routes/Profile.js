const express = require("express");
const { updateProfilePicture, deleteAccount, updateProfile, getAllUserDetails } = require("../controller/Profile");
const { auth } = require("../middleware/Auth");
const { resetPasswordToken, resetPassword } = require("../controller/ResetPassword");
const routes = express.Router();
// Update the profile
routes.put("/updateProfile",auth,updateProfile);
routes.patch("/updateProfilePicture",auth,updateProfilePicture);
routes.get("/getUserDetails",auth,getAllUserDetails);
//Delete
routes.delete("/deleteProfile",auth,deleteAccount); 
routes.post("/reset-password-token", resetPasswordToken); 
routes.post("/reset-password", resetPassword);

module.exports = routes;
