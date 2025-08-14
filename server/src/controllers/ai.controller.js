import OpenAI from "openai";
import { H_SYSTEM_PROMPT } from "../db/hitesh_systemPronpt.js";
import { AiModel } from "../models/ai.model.js";
import { MessageModel } from "../models/message.model.js";
import { P_SYSTEM_PROMPT } from "../db/piyush_systemPrompt.js";

export const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
});

// In-memory storage for conversations
const conversations = new Map();

// Utility functions
const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
// Create new conversation
const createConversation = async (req, res) => {
  try {
    const { type } = req.body;
    const conversationId = generateId();

    const data = await AiModel.create({
      name: `Conversation ${conversationId}`,
      createdAt: new Date(),
      lastActivity: new Date(),
      type: type || "hitesh", // Default to "hitesh" if not provided
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

    res.status(201).json({
      success: true,
      conversation: {
        id: conversation.id,
        name: conversation.name,
        createdAt: conversation.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
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

    // console.log(type);

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
    let conversation;
    conversation = conversations.get(id);
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
    // Add user message to context
    const message = await MessageModel.create({
      role: "user",
      content: query,
      conversationId: conversation.id,
      timestamp: new Date().toISOString(),
    });
    const userMessage = {
      id: message._id,
      role: "user",
      content: query,
      timestamp: message.timestamp,
    };

    conversation.messages.push(userMessage);

    // Prepare messages for AI API including conversation history
    const apiMessages = [
      {
        role: "system",
        content: conversation.systemPrompt,
      },
      // Include recent conversation history for context (last 10 messages)
      ...conversation.messages.slice(-15).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ];

    // Call AI API with stored conversation context
    const response = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: apiMessages,
    });

    const aiResponseContent = response.choices[0].message.content;

    // Add AI message to stored context
    const aimessage = await MessageModel.create({
      role: "assistant",
      content: aiResponseContent,
      conversationId: conversation.id,
      timestamp: new Date().toISOString(),
    });
    const aiMessage = {
      id: aimessage._id,
      role: "assistant",
      content: aiResponseContent,
      timestamp: aimessage.timestamp,
    };

    conversation.messages.push(aiMessage);
    // Update conversation last activity
    await AiModel.findByIdAndUpdate(id, {
      lastActivity: new Date().toISOString(),
    });
    conversation.lastActivity = new Date().toISOString();

    res.json({
      success: true,
      response: aiResponseContent,
      messageId: aiMessage.id,
      conversationId: id,
      limit: req.limit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to process query",
      message: error.message,
    });
  }
};

// Get conversation history
const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await AiModel.findById(id);
    const messages = await MessageModel.find({
      conversationId: conversation._id,
    });
    // console.log(conversation, messages);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    res.json({
      success: true,
      conversation: {
        id: conversation.id,
        name: conversation.name,
        type: conversation.type,
        messages: messages,
        createdAt: conversation.createdAt,
        lastActivity: conversation.lastActivity,
        messageCount: messages.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve conversation",
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

    res.json({
      success: true,
      conversations: allConversations,
      total: allConversations.length,
    });
  } catch (error) {
    res.status(500).json({
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

    await AiModel.deleteMany({ _id: id });
    await MessageModel.deleteMany({ conversationId: id });

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete conversation",
      message: error.message,
    });
  }
};

// Export functions for use
export {
  createConversation,
  handleQuery,
  getConversation,
  getAllConversations,
  deleteConversation,
};
