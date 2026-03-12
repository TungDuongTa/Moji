import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
  try {
    //get access token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }
    //verify token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);
          return res.status(403).json({ message: "Invalid access token" });
        }
        // Authorization
        //find user by id in token
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        //send user data in req
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Error in protectedRoute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
