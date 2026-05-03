import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Read the token from the cookies we saw in your Network tab
    const token = req.cookies.token; 

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // This allows getMe to find the user
        next();
    } catch (err) {
        console.log("JWT Error Type:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};