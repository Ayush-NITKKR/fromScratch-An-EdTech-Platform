const mailSender = require("../utils/mailSender");
const {mailTemplate, confirmationMail} = require("../mail/templates/contactUsMailTemplate");

exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNo, subject, message } = req.body;

        if (!firstName || !lastName || !email || !phoneNo) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // fire mails without blocking the response
        Promise.all([
            mailSender(
                "ayushtiwari449@gmail.com",
                `Contact Us: ${subject || "New Message"}`,
                mailTemplate({ first_name: firstName, last_name: lastName, email, phoneNumber: phoneNo, message })
            ),
            mailSender(
                email,
                "We received your message!",
                confirmationMail({ first_name: firstName, last_name: lastName, email, phoneNumber: phoneNo, message })
            ),
        ]).catch(err => console.error("ContactUs mail error:", err));

        return res.status(200).json({ success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("ContactUs API Error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
