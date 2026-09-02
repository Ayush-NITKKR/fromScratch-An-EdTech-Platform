const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

//Import the ROutes

const userRoutes = require('./routes/User');
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Courses");
const publicRoutes = require("./routes/Public");

//Database setup
const database = require("./config/db");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// Connect database
database.connect();

//MiddleWare
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {

        if (
            !origin ||
            /^http:\/\/localhost:\d+$/.test(origin) ||
            origin === "https://from-scratch-frontend.vercel.app" ||
            origin.endsWith(".vercel.app")
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
//Cloudinary Connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/public",publicRoutes);


//def route

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running...."
    });
});

// start the server

app.listen(PORT,()=>{
    console.log(`Server is started at ${PORT} successfully`);
    
})
