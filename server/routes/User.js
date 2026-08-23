const express = require("express");
const { signUp, login, sendOTP } = require("../controller/Auth");
const routes = express.Router();

routes.post('/signup',signUp);
routes.post('/login',login);
routes.post('/sendOtp',sendOTP);

module.exports = routes;