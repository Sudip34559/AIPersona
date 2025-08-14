import { Schema, model } from "mongoose";
const messageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Ai",
    required: true,
  },
});

export const MessageModel = model("Message", messageSchema);
