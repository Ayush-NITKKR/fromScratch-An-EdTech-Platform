const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");

const bcrypt = require("bcrypt");

//resetPasswordToken
//1. Get the data from the req
//2. validate the user
//3. Create the token
//4. update the token with expiry time
//5. send the link in the mail
//6. Send the response 

exports.resetPasswordToken = async (req,res) => {
    try{
    // Get the data from the user
    const {email} = req.body;

    //Validate the user 

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found in the database"
        })
    }

    //Create the token

    const token = crypto.randomUUID();// create valid token

    // Update the token 

    const dbEntry = await User.findOneAndUpdate(
                                                {email},
                                               {
                                                    token:token,
                                                    resetPassworExpiry:Date.now() + 5 * 60 * 1000,
                                               },
                                               {new:true}
                                            );
   // console.log(dbEntry);
    
    //Create the URL
    const url = `${process.env.FRONTEND_URL || "http://localhost:5173"}/update-password/${token}`
    //Send the mail
    await mailSender(email,"Reset Password Link"
                                                ,` password Reset Link :${url} `);
    //Return response
    return res.status(200).json({
        success:true,
        message:"The reset mail sent successfully"
    })
    }
    catch(error){
        console.log("Errror in password reset");
        console.log(error.message);
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Something went wrong during password reseting"
        })
    }
}
// Reset password
//1. get the token ,data password , confirm password 
//2. validate the password
//3. validate the token with DB
//4. hash the password
//5. update the password in the DB
//6. return response
exports.resetPassword = async (req, res) => {

   try {
        // 1. get the data from the body
        const {token , password , confirmPassword} = req.body;

        //2. Validation of token
            //does this token exist in the db
            const tokenExist = await User.findOne({token});
            // console.log(tokenExist);
            
            if(!tokenExist){
                return res.status(400).json({
                    success:false,
                    message:"User does not exist in the Database"
                })
            }
            if(tokenExist.resetPassworExpiry < Date.now()){
                return res.status(400).json({
                    success:false,
                    message:"Link is expired please regenerate the password"
                })
            }
        //3.Validate the password
            if(password !== confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"passwords are not matching"
                })
            }
            if(password.length < 8){
                return res.status(400).json({
                    success:false,
                    message:"password length is less than 8"
                })
            }
        //4.Hash The password
           const hashedPassword = await bcrypt.hash(password , 10);
        
        //5.Update the password in the database

          await User.findOneAndUpdate(
                                            {token},
                                            {
                                            password:hashedPassword,
                                            token: undefined,
                                            resetPassworExpiry: undefined,
                                             }
                                        )
        //6.Return the response

        res.status(201).json({
            success:true,
            message:"password is reset successfully"
        })
            
   } catch (error) {
        console.log("Error in the passord reseting");
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Something went wrong during password reseting"
        })
   }
}
