const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req, res ,  next) => {
    try {
        const authHeader = req.header("Authorization");

        const token =
            req.cookies?.token ||
            req.body?.token ||
            (authHeader ? authHeader.replace("Bearer ", "") : null);

        // validate

        //console.log(token);
        

        if(!token){
            return res.status(400).json({
            success:false,
            message:"token is missing"
        })
        }

        // verify

        try {
            const decode =jwt.verify(token , process.env.JWT_SECRET);
           // console.log(decode);
            
            // put the decoded obj in req
            req.user = decode;
        } catch (error) {

    console.log(error);

    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Session expired. Please login again."
        });
    }

    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }

    return res.status(401).json({
        success: false,
        message: "Authentication failed."
    });
}
        next();     
    } catch(eror){
        console.log(eror);
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })

    }
}

//isStudent
// 1 . req role is student then pass it to next
// 2 . if role is not student then return the res
exports.isStudent = async (req, res , next) => {
    try {
        
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success:false,
                message:"This protected Route for Students Only",
            });
        }
        next();
        
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            success:false,
            message:"Something went wrong on validating the student"
        })
    }
}
//isInstructor
exports.isInstructor = async (req, res , next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success:false,
                message:"This is the protected route of the instructor"
            })
        }
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while validating the instructor"
        })
    }
}
//isAdmin
exports.isAdmin = async (req, res , next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success:false,
                message:"This is the protected route of the Admin"
            })
        }
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while validating the Admin"
        })
    }
}
