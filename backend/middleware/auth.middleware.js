import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch full user from DB (without password)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    //  Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware : " + error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid access token" });
    }

    return res.status(500).json({ error: "Server error" });
  }
};


export const adminOnly = (req, res , next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    } else {
        res.status(403).json({message: "Admin access only"});
    }
}