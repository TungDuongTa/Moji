import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10

    // Save the user to the database
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    //return success response
    return res.sendStatus(204); // Created
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const ACCESS_TOKEN_TTL = "30s";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14 days in milliseconds
export const signIn = async (req, res) => {
  try {
    //input from request body
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    //compare hashed password with the one in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //generate JWT token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    //generate refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    //create new session in database with refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    //send refresh token in httpOnly cookie and access token in response body
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    return res
      .status(200)
      .json({ message: `User ${user.displayName} is logged in`, accessToken });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    //get refresh token from cookie
    const token = req.cookies?.refreshToken;
    if (token) {
      await Session.deleteOne({ refreshToken: token });
      //delete refresh token from sessions
      //delete cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error in signOut:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//create new accesstoken from refresh token
export const refreshToken = async (req, res) => {
  try {
    //get refresh token from cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token not exist" });
    }
    //compate to refres token in db
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    //check expire
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Expired token" });
    }
    //generate new accesstoken
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("error while calling refreshToken", error);
    return res.status(500).json({ message: "Internal error" });
  }
};
