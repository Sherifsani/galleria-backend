const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedToken;
        next();
    }catch (error) {
        console.log("Error verifying token: ", error);
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
}
 
module.exports = authMiddleware;