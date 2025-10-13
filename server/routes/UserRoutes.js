const express = require("express");
const { registerUser,loginUser,getAllUsers } = require("../Controllers/UserControllers");



const router = express.Router();

//get all users
router.get("/",getAllUsers)

// user Signup
router.post("/register", registerUser)
// user login
router.post("/login",loginUser)

//get all users
router.get("/",getAllUsers)

module.exports =  router;