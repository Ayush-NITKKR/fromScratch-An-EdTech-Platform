const mailSender = require("../utils/mailSender");
const {mailTemplate, confirmationMail} = require("../mail/templates/contactUsMailTemplate");

exports.contactUs = async (req,res) => {
    try {
        // Get the data — field names match the frontend formData keys
        const { firstName, lastName, email, phoneNo, subject, message } = req.body;

        // Validate required fields
        if(!firstName || !lastName || !email || !phoneNo){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Send the message to the admin
        await mailSender(
            "ayushtiwari449@gmail.com",
            `Contact Us: ${subject || "New Message"}`,
            mailTemplate({ first_name: firstName, last_name: lastName, email, phoneNumber: phoneNo, message })
        );

        // Send a confirmation email to the user
        await mailSender(
            email,
            "We received your message!",
            confirmationMail({ first_name: firstName, last_name: lastName, email, phoneNumber: phoneNo, message })
        );
        
        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch(error) {
        // Bug fix: catch now logs the error — previously was catch {} with no param
        console.error("ContactUs API Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}
