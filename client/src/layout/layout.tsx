import { AppSidebar } from "@/components/app-sidebar";
import { Send, User, Loader2 } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useEffect, useRef, useState } from "react";
import api from "@/API/api";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

// Typing Animation Component
const TypingAnimation = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};

export default function Layout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const halgelSelect = (id: string) => {
    console.log("Selected ID:", id);
    setId(id);
    setIsLoading(true);
    api
      .get(`/ai/conversation/${id}`)
      .then((response) => {
        console.log(
          "Conversations fetched:",
          response.data.conversation.messages
        );
        setType(response.data.conversation.type);
        setMessages(response.data.conversation.messages);
      })
      .catch((error) => {
        console.error("Error fetching conversation:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        role: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      const currentMessage = newMessage;
      setNewMessage("");
      setIsLoading(true);

      api
        .post(`/ai/conversation/${id}/query`, {
          query: currentMessage,
        })
        .then((response) => {
          console.log("AI Response:", response);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: response.data.messageId,
              content: response.data.response,
              role: "assistant",
              timestamp: new Date().toISOString(),
            },
          ]);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          // Optionally show error message to user
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar halgelSelect={halgelSelect} setId={setId} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {id.trim() ? (
            <div className="flex flex-col h-full text-white">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-10 h-10 overflow-hidden bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            type === "hitesh"
                              ? "/11613311.png"
                              : "/download.jpg"
                          }
                          alt=""
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-white text-black ml-auto"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Animation */}
                {isLoading && (
                  <div className="flex items-start space-x-3 justify-start">
                    <div className="w-10 h-10 overflow-hidden bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <img
                        className="w-full h-full object-cover"
                        src={
                          type === "hitesh" ? "/11613311.png" : "/download.jpg"
                        }
                        alt=""
                      />
                    </div>
                    <div className="max-w-[70%] p-3 rounded-2xl bg-gray-800 text-white">
                      <TypingAnimation />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className=" border-t  p-4">
                <div className="flex items-end space-x-3 bg-gray-800 rounded-2xl border border-gray-600 p-3">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message... "
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[20px] max-h-[120px] py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={1}
                    style={{
                      height: "40px",
                      lineHeight: "1.5",
                    }}
                  />

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className="w-10 h-10 bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                    ) : (
                      <Send
                        className={`w-5 h-5 ${
                          newMessage.trim() ? "text-black" : "text-gray-400"
                        }`}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium">
                  Select a conversation to start chatting
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Choose from your conversations in the sidebar
                </p>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
