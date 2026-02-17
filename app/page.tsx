"use client";
import React, { useEffect, useRef } from "react";

type Message = {
  role: "user" | "assistant"
  text: string
};

export default function App() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong." },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-[#131314] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#1e1f20] p-4 border-r border-gray-800 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>

        <div className="space-y-2 overflow-y-auto">
          {messages
            .filter((m) => m.role === "user")
            .map((msg, index) => (
              <div
                key={index}
                className="p-2 rounded-md bg-[#2a2b2d] text-sm truncate cursor-pointer hover:bg-[#333436] transition"
              >
                {msg.text.slice(0, 30)}
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="p-4 border-b border-gray-800 text-xl font-semibold">
          Tejas's Chatbot
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xl px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#2a2b2d] text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#2a2b2d] px-5 py-3 rounded-2xl text-gray-400 text-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 bg-[#1e1f20]">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 bg-[#2a2b2d] rounded-xl px-4 py-3 text-sm outline-none border border-gray-700 focus:border-blue-500 disabled:opacity-50"
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  )
};
