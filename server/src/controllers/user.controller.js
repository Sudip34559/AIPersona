import { RequestLimitModel } from "../models/request.model.js";
import { User } from "../models/user.model.js";

export const generateAccessTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found for token generation");
  }
  const accessToken = user.generateAccessToken();
  return { accessToken };
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => !field?.trim())) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    const user = await User.create({ name, email, password });
    const { accessToken } = await generateAccessTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");

    if (!loggedInUser) {
      return res.status(400).json({
        success: false,
        error: "User not found after registration",
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).cookie("accessToken", accessToken, options).json({
      success: true,
      user: loggedInUser,
      accessToken,
      message: "User registered and logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to register",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const { accessToken } = await generateAccessTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).cookie("accessToken", accessToken, options).json({
      success: true,
      user: loggedInUser,
      accessToken,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to login",
      message: error.message,
    });
  }
};

const token = async (req, res) => {
  try {
    const id = req.user._id;
    const tokenDoc = await RequestLimitModel.findOne({ identifier: id });
    console.log(`Token for user ${id}:`, tokenDoc);

    if (!tokenDoc) {
      return res.status(404).json({
        success: false,
        error: "Token not found",
      });
    }

    return res.status(200).json({
      success: true,
      token: tokenDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch token",
      message: error.message,
    });
  }
};

export { register, login, token };
