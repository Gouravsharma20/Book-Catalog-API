const express = require("express");
const { registerUser,loginUser,getAllUser } = require("../Controllers/UserControllers");

const router = express.Router();

//get all users
router.get("/",getAllUser)

// user Signup
router.post("/register", registerUser)
// user login
router.post("/login",loginUser)

module.exports =  router;