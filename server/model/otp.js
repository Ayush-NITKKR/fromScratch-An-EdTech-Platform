const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
  await mailSender(
    email,
    "Verification Email from EdTech",
    `<h1>Your OTP is: ${otp}</h1>`
  );
}

// Pre middleware 
otpSchema.pre("save", async function () {

  console.log("New document saved to database");

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
});

module.exports = mongoose.model("OTP", otpSchema);
