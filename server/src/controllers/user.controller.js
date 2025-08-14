import { User } from "../models/user.model.js";
export const generateAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to generate access token",
    });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.status(400).json({
      success: false,
      error: "Name, email and password are required",
    });
  }
  const existeduser = await User.findOne({ email });
  if (existeduser) {
    res.status(400).json({
      success: false,
      error: "User with this email already exists",
    });
  }
  const user = await User.create({ name, email, password });
  const { accessToken } = await generateAccessTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password");
  if (!loggedInUser) {
    res.status(400).json({
      success: false,
      error: "User not found",
    });
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  // check for user creation
  return res.status(200).cookie("accessToken", accessToken, options).json({
    success: true,
    user: loggedInUser,
    accessToken,
    message: "user logged in successfully",
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password && !email) {
      res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      res.status(400).json({
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

export { register, login };
