const express = require("express");
const { contactUs } = require("../controller/ContactUs");

const router = express.Router();

router.post("/contact", contactUs);

module.exports = router;