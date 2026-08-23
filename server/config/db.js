const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Database is connected successfully")
    })
    .catch((error)=>{
        console.error(error.message);
        console.log("Some isuue in the Database connection");
        process.exit(1);
    })
}
