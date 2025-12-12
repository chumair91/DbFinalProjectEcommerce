import React, { useEffect, useState, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import { FaTimes, FaPaperPlane, FaRobot, FaHeadset } from "react-icons/fa";

export default function ChatPopup({ isOpen, onClose, user }) {
  const [chatMode, setChatMode] = useState("choice"); // "choice", "chatbot", "agent"
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [noResponseTimeout, setNoResponseTimeout] = useState(null);
  const [chatbotLoading, setChatbotLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const registeredRef = useRef(false);
  const clientIdRef = useRef("");
  const NO_RESPONSE_DURATION = 5 * 60 * 1000; // 5 minutes without response

  // Generate and cache client ID once
  useMemo(() => {
    if (!clientIdRef.current) {
      if (user && user.email) {
        clientIdRef.current = `user_${user._id || user.email}`;
      } else {
        clientIdRef.current = `guest_${Math.random().toString(36).substr(2, 9)}`;
      }
      console.log("Generated client ID:", clientIdRef.current);
    }
  }, [user]);

  // Load messages from localStorage when chatMode switches to agent
  useEffect(() => {
    if (chatMode === "agent" && clientIdRef.current) {
      const saved = localStorage.getItem(`chat_${clientIdRef.current}`);
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
          console.log("Loaded messages from localStorage for", clientIdRef.current);
        } catch (e) {
          console.error("Failed to parse saved messages:", e);
        }
      }
    }
  }, [chatMode]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (clientIdRef.current && messages.length > 0) {
      try {
        localStorage.setItem(`chat_${clientIdRef.current}`, JSON.stringify(messages));
        console.log("Saved messages to localStorage");
      } catch (e) {
        console.error("Failed to save messages to localStorage:", e);
      }
    }
  }, [messages]);

  // Handle socket events when chatMode changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !clientIdRef.current) return;

    // Only register if chatMode is "agent"
    if (chatMode !== "agent") {
      registeredRef.current = false;
      return;
    }

    // Prevent duplicate registration
    if (registeredRef.current) return;

    // Connection status
    const onConnect = () => {
      setIsConnected(true);
      console.log("Connected to chat server");
      
      if (!registeredRef.current) {
        socket.emit("client_register", {
          clientId: clientIdRef.current,
          userId: user?._id || null,
          email: user?.email || "guest@example.com",
          name: user?.name || "Guest User"
        });
        registeredRef.current = true;
        console.log("Client registered:", clientIdRef.current);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onNewMessage = ({ message }) => {
      console.log("Client received message:", message);
      setMessages((prev) => [...prev, message]);
      
      // Reset no-response timeout when agent responds
      if (message.from === "agent") {
        if (noResponseTimeout) clearTimeout(noResponseTimeout);
        setNoResponseTimeout(null);
      }
      
      scrollToBottom();
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    socket.on("new_message", onNewMessage);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [chatMode]);

  const sendMessage = () => {
    if (!inputMsg.trim()) return;

    const msgObj = {
      from: "client",
      text: inputMsg,
      time: Date.now(),
      metadata: {
        userId: user?._id,
        userEmail: user?.email,
        pageUrl: window.location.href
      }
    };

    setMessages((prev) => [...prev, msgObj]);

    socketRef.current.emit("client_message", {
      clientId: clientIdRef.current,
      message: inputMsg,
      metadata: {
        userId: user?._id,
        userEmail: user?.email,
        pageUrl: window.location.href
      }
    });

    setInputMsg("");
    scrollToBottom();
    
    // Set timeout for no response - escalate to chatbot after 5 minutes
    if (noResponseTimeout) clearTimeout(noResponseTimeout);
    const timeout = setTimeout(() => {
      setMessages(prev => [...prev, {
        from: "system",
        text: "Our agents are busy. Would you like to chat with our automated assistant?",
        time: Date.now()
      }]);
    }, NO_RESPONSE_DURATION);
    setNoResponseTimeout(timeout);
  };

  const handleChooseChatbot = () => {
    setChatMode("chatbot");
    setChatbotLoading(true);
    setMessages([]);
  };

  const handleChooseAgent = () => {
    setChatMode("agent");
    // Don't clear messages - load from localStorage instead
  };

  const handleBackToChoice = () => {
    setChatMode("choice");
    // Don't clear messages, keep them saved for next time
    if (noResponseTimeout) clearTimeout(noResponseTimeout);
  };

  const clearChatHistory = () => {
    if (clientIdRef.current) {
      localStorage.removeItem(`chat_${clientIdRef.current}`);
      setMessages([]);
      console.log("Cleared chat history");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isOpen) return null;

  // Choice Screen - User selects between chatbot or agent
  if (chatMode === "choice") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6 flex justify-between items-center">
            <h3 className="font-bold text-lg">How can we help?</h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-center mb-6">Choose how you'd like to get support</p>
            
            {/* Chatbot Option */}
            <button
              onClick={handleChooseChatbot}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-4 text-left"
            >
              <FaRobot className="text-3xl text-blue-500" />
              <div>
                <h4 className="font-semibold text-gray-800">Chatbot</h4>
                <p className="text-sm text-gray-500">Instant answers 24/7</p>
              </div>
            </button>

            {/* Live Agent Option */}
            <button
              onClick={handleChooseAgent}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition flex items-center gap-4 text-left"
            >
              <FaHeadset className="text-3xl text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Live Agent</h4>
                <p className="text-sm text-gray-500">Chat with a human</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chatbot Mode
  if (chatMode === "chatbot") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot className="text-xl" />
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-sm opacity-90">Powered by Chatbot</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chatbot Content - JotForm Embed */}
          <div className="flex-1 overflow-y-auto p-2 bg-gray-50 relative">
            {/* Loading Overlay */}
            {chatbotLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-b-xl z-10">
                <div className="text-center">
                  {/* Spinner Animation */}
                  <div className="flex justify-center mb-4">
                    <div className="animate-spin">
                      <FaRobot className="text-6xl text-blue-500" />
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold mb-2">Connecting to AI Assistant</p>
                  <p className="text-sm text-gray-500 mb-4">Please wait a few seconds...</p>
                  {/* Progress dots animation */}
                  <div className="flex gap-1 justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0s"}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <iframe 
              id="JotFormIFrame-019afa15d94c78fdb39741801efeed257cad" 
              title="Support Consultant"
              onLoad={() => setChatbotLoading(false)}
              allowTransparency={true}
              allow="geolocation; microphone; camera; fullscreen"
              src="https://agent.jotform.com/019afa15d94c78fdb39741801efeed257cad?embedMode=iframe&background=1&shadow=1"
              frameBorder="0" 
              style={{
                maxWidth: "100%",
                height: "520px",
                border: "none",
                width: "100%"
              }} 
              scrolling="no"
            />
          </div>

          {/* Footer with back button */}
          <div className="border-t p-3 bg-white rounded-b-xl">
            <button
              onClick={handleBackToChoice}
              className="w-full text-xs text-gray-500 hover:text-gray-700 py-2"
            >
              ← Back to options
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live Agent Mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Customer Support</h3>
            <div className="text-sm opacity-90 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Hi! You're chatting with {user?.name || "Guest"}. Our support team will respond shortly.
            </p>
          </div>
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-3 ${msg.from === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.from === "client"
                    ? "bg-green-100 text-gray-800 rounded-br-none"
                    : "bg-blue-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white rounded-b-xl">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMsg.trim()}
              className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="flex gap-2 justify-between">
            <button
              onClick={handleBackToChoice}
              className="text-xs text-gray-500 hover:text-gray-700 py-1"
            >
              ← Back
            </button>
            <button
              onClick={clearChatHistory}
              className="text-xs text-red-500 hover:text-red-700 py-1"
            >
              Clear History
            </button>
          </div>
          <button
            onClick={handleBackToChoice}
            className="w-full text-xs text-gray-500 hover:text-gray-700 py-2"
          >
            ← Back to options
          </button>
        </div>
      </div>
    </div>
  );
}