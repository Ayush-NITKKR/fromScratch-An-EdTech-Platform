const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    secure: false, // true if port 465
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    // optional but helps diagnose:
    connectionTimeout: 10000,
});

const mailSender = async (email, title, body) => {
    const requestId = Math.random().toString(36).substring(2, 8);


    try {
        const start = performance.now();

        const info = await transporter.sendMail({
            from: process.env.MAIL_ID,
            to: email,
            subject: title,
            html: body, 
        });


        return info;
    } catch (error) {
        console.log(`[${requestId}] ${error.message}`);
        throw error;
    }
};

module.exports = mailSender;