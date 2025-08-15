import { Router } from "express";

import {
  createConversation,
  handleQuery,
  getConversation,
  getAllConversations,
  deleteConversation,
} from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import requestLimiter from "../middlewares/request.middlewares.js";

const router = Router();

router.use(verifyJWT);
// Create new conversation
router.route("/conversation").post(createConversation);
// Send query to AI
router.route("/conversation/:id/query").post(requestLimiter, handleQuery);
// Get conversation by ID
router.route("/conversation/:id").get(getConversation);

// Get all conversations
router.route("/conversations").get(getAllConversations);

// Delete conversation
router.route("/conversation/:id").delete(deleteConversation);

export default router;
