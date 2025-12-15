const express = require("express");
const router = express.Router();
const user = require("../controllers/user_controller");

router.post("/register", user.register);
router.post("/login", user.login);
router.post("/forget-password", user.forgetPassword);
router.post("/reset-password", user.resetPassword);

module.exports = router;
