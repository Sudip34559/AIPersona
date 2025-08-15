import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);
    if (!token) {
      return res.status(411).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(411).json({
        status: false,
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(411).json({
      status: false,
      message: "Somthing went wrong",
    });
  }
};

export { verifyJWT };
