const express = require("express");
const routes = express.Router();
const { auth } = require("../middleware/Auth");
const { capturePayment,verifyPayment, sendPaymentSuccessEmail, getPaymentHistory } = require("../controller/Payments");

routes.post("/capturePayment", auth, capturePayment);
routes.post("/verifyPayment",auth, verifyPayment);
routes.post("/sendPaymentSuccessMail",auth, sendPaymentSuccessEmail);
routes.get("/history", auth, getPaymentHistory);

module.exports = routes;
