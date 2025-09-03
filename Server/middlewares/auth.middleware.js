const User = require("../models/user");
const jwt = require("jsonwebtoken");

const protectRoute = async(req, res, next) => {
    try {
        // extraction:
        const token = req.cookies.token;
        
        if(!token)  {
            return res.status(401).json({ message: "Unauthorized access." });
        }

        // token verification:
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password -OTP");
        
        if(!user) {
            return res.status(401).json({ message: "Unauthorized access." });
        }

        req.user = user;

        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while authenticating." });
    }
}

module.exports = { protectRoute };