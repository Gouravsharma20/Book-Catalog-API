const { hash } = require("bcryptjs");
const User = require("../models/UserModel")
const createToken = require("../utils/token")

// Register User
const registerUser = async (req, res) => {
    const {name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(400).json({ error: "name, email and password are required to signup" })
    }
    try {
        const user = await User.register(name, email, password)
        const token = createToken(user._id)
        res.status(201).json({
            success:true,
            message: "Registered successfully",
            user:user.toSafeObject(),
            token });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
// Login User
const loginUser = async (req, res) => {
    const {email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({
            error: "email and password are required to login"
        })
    }
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';
        const user = await User.login(email, password, ipAddress, userAgent)
        const token = createToken(user._id)
        res.status(200).json({
            success:true,
            message: "Login Successful",
            user:user.toSafeObject(),
            token
        });
    } catch (err) {
        if (err.message.includes("Account is locked")){
            return res.status(423).json({
                error:err.message,
                type:"ACCOUNT_LOCKED"
            })
        }
        if(err.message.includes("Incorrect Password")){
            return res.status(401).json({
                error:"invalid email or password",
                type:"INVALID_CREDENTIALS"
            });
        }
        if (err.message.includes("User doesn't exist")) {
            return res.status(404).json({
                error: "user doest exists",
                type: "INVALID_CREDENTIALS"
            });
        }
        res.status(400).json({error:err.message})
    }
}

module.exports = {
    registerUser,
    loginUser
}

