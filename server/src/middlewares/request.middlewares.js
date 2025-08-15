import { Types } from "mongoose";
import { RequestLimitModel } from "../models/request.model.js";
import { User } from "../models/user.model.js";

const requestLimiter = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    const isAuthenticated = user ? true : false;

    // Set limits
    const dailyLimit = 20;
    // console.log(isAuthenticated, userId, dailyLimit, user);

    // Find existing record
    let record = await RequestLimitModel.findOne({
      identifier: req.user?._id,
    });

    // Create new record if doesn't exist
    if (!record) {
      record = await RequestLimitModel.create({
        identifier: userId,
        count: 1,
        lastReset: new Date(),
      });
      req.limit = {
        remaining: dailyLimit - record.count,
        limit: dailyLimit,
      };
      return next();
    }

    // Reset counter if new day
    const now = new Date();
    const lastReset = new Date(record.lastReset);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (lastReset < oneDayAgo) {
      record.count = 1;
      record.lastReset = now;
      await record.save();
      return next();
    }

    // Increment count
    record.count += 1;
    req.limit = {
      remaining: dailyLimit - record.count,
      limit: dailyLimit,
    };
    // Check limit
    if (record.count > dailyLimit) {
      return res.status(429).json({
        message: "Rate limit exceeded. Try again tomorrow.",
        limit: dailyLimit,
      });
    }

    await record.save();
    next();
  } catch (err) {
    console.error("Rate limiter error:", err.message);
    next(); // Continue on error
  }
};

export default requestLimiter;
