const express = require("express");
const router = express.Router();
const { signupUser, signinUser, verifyOtp } = require("../controllers/user.controllers.js");

router.route("/signup").post(
    signupUser
);

router.route("/signin").post(
    signinUser
);

router.route("/verify-email").post(
    verifyOtp
)

module.exports = router;