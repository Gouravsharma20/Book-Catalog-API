const express = require("express");
const { registerUser,loginUser,getAllUsers } = require("../Controllers/UserControllers");

const router = express.Router();

// user Signup
router.post("/register", registerUser)
// user login
router.post("/login",loginUser)

//get all users
router.get("/",getAllUsers)

module.exports =  router;