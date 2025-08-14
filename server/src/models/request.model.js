import { Schema, model } from "mongoose";

const requestLimitSchema = new Schema({
  identifier: String, // IP or user ID
  count: Number,
  lastReset: Date,
});
export const RequestLimitModel = model("RequestLimit", requestLimitSchema);
