const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({message:"unauthorized"});
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Invalid token format" });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded
        next()

    }catch(err){
        return res.status(403).json({message:"Invalid token or not signed in"})
    }
}

module.exports = authMiddleware