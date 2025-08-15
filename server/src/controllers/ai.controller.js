import OpenAI from "openai";
import { H_SYSTEM_PROMPT } from "../db/hitesh_systemPronpt.js";
import { P_SYSTEM_PROMPT } from "../db/piyush_systemPrompt.js";
import { AiModel } from "../models/ai.model.js";
import { MessageModel } from "../models/message.model.js";

export const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
});

// In-memory storage for conversations
const conversations = new Map();

// Utility: Generate unique ID
const generateId = () =>
  Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

// Create new conversation
const createConversation = async (req, res) => {
  try {
    const { type } = req.body;
    const conversationId = generateId();

    const data = await AiModel.create({
      name: `Conversation ${conversationId}`,
      createdAt: new Date(),
      lastActivity: new Date(),
      type: type || "hitesh",
      userId: req.user._id,
    });

    const conversation = {
      id: data._id,
      name: data.name,
      systemPrompt:
        type === "hitesh" ? H_SYSTEM_PROMPT : "You are a helpful assistant.",
      messages: [],
      createdAt: data.createdAt,
      lastActivity: data.lastActivity,
    };

    conversations.set(data._id, conversation);

    return res.status(201).json({
      success: true,
      conversation: {
        id: conversation.id,
        name: conversation.name,
        createdAt: conversation.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to create conversation",
      message: error.message,
    });
  }
};

// Handle user query and generate AI response
const handleQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required",
      });
    }

    const data = await AiModel.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    let conversation = conversations.get(id);
    if (!conversation) {
      conversation = {
        id: data._id,
        name: data.name,
        systemPrompt:
          data.type === "hitesh" ? H_SYSTEM_PROMPT : P_SYSTEM_PROMPT,
        messages: [],
        createdAt: data.createdAt,
        lastActivity: data.lastActivity,
      };
      conversations.set(data._id, conversation);
    }

    // Add user message to DB & memory
    const message = await MessageModel.create({
      role: "user",
      content: query,
      conversationId: conversation.id,
      timestamp: new Date().toISOString(),
    });

    conversation.messages.push({
      id: message._id,
      role: "user",
      content: query,
      timestamp: message.timestamp,
    });

    // Prepare messages for API
    const apiMessages = [
      { role: "system", content: conversation.systemPrompt },
      ...conversation.messages.slice(-15).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call AI API
    const response = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: apiMessages,
    });

    const aiResponseContent = response.choices[0]?.message?.content || "";

    // Store AI message
    const aiMsgDoc = await MessageModel.create({
      role: "assistant",
      content: aiResponseContent,
      conversationId: conversation.id,
      timestamp: new Date().toISOString(),
    });

    conversation.messages.push({
      id: aiMsgDoc._id,
      role: "assistant",
      content: aiResponseContent,
      timestamp: aiMsgDoc.timestamp,
    });

    // Update last activity
    const now = new Date().toISOString();
    await AiModel.findByIdAndUpdate(id, { lastActivity: now });
    conversation.lastActivity = now;

    return res.json({
      success: true,
      response: aiResponseContent,
      messageId: aiMsgDoc._id,
      conversationId: id,
      limit: req.limit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to process query",
      message: error.message,
    });
  }
};

// Get conversation history
const getConversation = async (req, res) => {
  try {
    const id = req.params.id;
    const conversation = await AiModel.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    const messages = await MessageModel.find({
      conversationId: conversation._id,
    });

    return res.json({
      success: true,
      conversation: {
        id: conversation._id,
        name: conversation.name,
        type: conversation.type,
        messages,
        createdAt: conversation.createdAt,
        lastActivity: conversation.lastActivity,
        messageCount: messages.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch conversation",
      message: error.message,
    });
  }
};

// Get all conversations
const getAllConversations = async (req, res) => {
  try {
    const allConversations = await AiModel.find({ userId: req.user._id })
      .sort({ lastActivity: -1 })
      .select("name lastActivity type");

    return res.json({
      success: true,
      conversations: allConversations,
      total: allConversations.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve conversations",
      message: error.message,
    });
  }
};

// Delete conversation
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    await AiModel.deleteOne({ _id: id });
    await MessageModel.deleteMany({ conversationId: id });

    return res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to delete conversation",
      message: error.message,
    });
  }
};

export {
  createConversation,
  handleQuery,
  getConversation,
  getAllConversations,
  deleteConversation,
};
