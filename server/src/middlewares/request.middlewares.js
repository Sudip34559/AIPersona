import { RequestLimitModel } from "../models/request.model.js";
import { User } from "../models/user.model.js";

const requestLimiter = async (req, res, next) => {
  try {
    const identifier = req.body.user?._id?.toString() || req.ip;
    const user = await User.findById(identifier);
    const isAuthenticated = user ? true : false;

    // Set limits
    const dailyLimit = isAuthenticated ? 20 : 5;
    // console.log(isAuthenticated, identifier, dailyLimit);

    // Find existing record
    let record = await RequestLimitModel.findOne({ identifier });

    // Create new record if doesn't exist
    if (!record) {
      record = await RequestLimitModel.create({
        identifier,
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
      if (!isAuthenticated) {
        return res.status(429).json({
          message: "Login to increase your request limit.",
          limit: dailyLimit,
        });
      }
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
