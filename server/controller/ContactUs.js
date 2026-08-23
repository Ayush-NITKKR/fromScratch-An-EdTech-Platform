const mailSender = require("../utils/mailSender");
const {mailTemplate, confirmationMail} = require("../mail/templates/contactUsMailTemplate");

exports.contactUs = async (req,res) => {
    try {
        //Get the data
        const {first_name , last_name , email , phoneNumber ,message} = req.body;

        //Validate the Email
        if(!first_name || !last_name || !email || !phoneNumber){
            return res.status(404).json({
                success:false,
                message:"All feilds are required"
            })
        }
        //send the mail to the admin (ayushtiwari449@gmail.com)
        await mailSender("ayushtiwari449@gmail.com",
            "User Message To Our team",
            mailTemplate({ first_name,last_name,email,phoneNumber,message })
        );
        // send mail to user for conformation 
        await mailSender(email,
            "Hyy we get Our messageSuccessfully",
             confirmationMail({ first_name,last_name,email,phoneNumber,message }));
        
        return res.status(200).json({
            success:true,
            message:"Message sent successfully"
        });

    } catch {
        return res.status(500).json({
            success:false,
            message:"Something Went wrong"
        })
    }
}
