const express = require("express");
const { registerUser,loginUser } = require("../Controllers/UserControllers");

const router = express.Router();

// user Signup
router.post("/register", registerUser)
// user login
router.post("/login",loginUser)

module.exports =  router;