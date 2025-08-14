import { Schema, model } from "mongoose";

const aiSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["hitesh", "piyush"],
    default: "hitesh",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
export const AiModel = model("conversation", aiSchema);
