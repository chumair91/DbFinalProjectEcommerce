import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function AgentPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messagesByClient, setMessagesByClient] = useState({});
  const [unreadCount, setUnreadCount] = useState({});
  const [agentMsg, setAgentMsg] = useState("");
  const [clientInfo, setClientInfo] = useState({}); // Store client info
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const registeredRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize socket once
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_BACKEND_URL);
    }
    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, []);

  // Handle socket events - register agent
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onConnect = () => {
      console.log("Agent connected to server");
      // Register as agent AFTER connection, but only once
      if (!registeredRef.current) {
        socket.emit("agent_register");
        registeredRef.current = true;
      }
    };

    const onClientsList = (list) => {
      console.log("Received clients list:", list);
      setClients(list);
      setMessagesByClient((prev) => {
        const copy = { ...prev };
        list.forEach((c) => { if (!copy[c]) copy[c] = []; });
        return copy;
      });
      setUnreadCount((prev) => {
        const copy = { ...prev };
        list.forEach((c) => { if (copy[c] === undefined) copy[c] = 0; });
        return copy;
      });
    };

    const onChatHistory = ({ clientId, messages, userInfo }) => {
      console.log("Received chat history for", clientId, ":", messages);
      const finalMessages = messages || [];
      setMessagesByClient((prev) => ({ ...prev, [clientId]: finalMessages }));
      // Save to localStorage
      localStorage.setItem(`agent_chat_${clientId}`, JSON.stringify(finalMessages));
      if (userInfo) {
        setClientInfo(prev => ({ ...prev, [clientId]: userInfo }));
      }
    };

    const onNewMessage = ({ clientId, message, userInfo }) => {
      console.log("Agent received new_message:", { clientId, message, userInfo });
      setMessagesByClient((prev) => {
        const existingMessages = prev[clientId] || [];
        // Check if message already exists to prevent duplicates
        const messageExists = existingMessages.some(m => 
          m.text === message.text && m.time === message.time && m.from === message.from
        );
        if (messageExists) {
          console.log("Message already exists, skipping duplicate");
          return prev;
        }
        const clientMessages = [...existingMessages, message];
        console.log("Updated messages for", clientId, ":", clientMessages);
        // Save to localStorage
        localStorage.setItem(`agent_chat_${clientId}`, JSON.stringify(clientMessages));
        return { ...prev, [clientId]: clientMessages };
      });

      if (userInfo) {
        setClientInfo(prev => ({ ...prev, [clientId]: userInfo }));
      }

      // Update unread count
      setUnreadCount((prev) => {
        const prevCount = prev[clientId] || 0;
        if (clientId === selectedClient) {
          return { ...prev, [clientId]: 0 };
        } else {
          return { ...prev, [clientId]: prevCount + 1 };
        }
      });
    };

    // If already connected, register immediately
    if (socket.connected) {
      onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    socket.on("clients_list", onClientsList);
    
    // Load stored messages from localStorage for all clients
    const loadStoredMessages = () => {
      setMessagesByClient((prev) => {
        const updated = { ...prev };
        clients.forEach((clientId) => {
          const stored = localStorage.getItem(`agent_chat_${clientId}`);
          if (stored && !updated[clientId]?.length) {
            try {
              updated[clientId] = JSON.parse(stored);
              console.log("Loaded stored messages for", clientId);
            } catch (e) {
              console.error("Failed to parse stored messages for", clientId, e);
            }
          }
        });
        return updated;
      });
    };
    
    loadStoredMessages();    socket.on("chat_history", onChatHistory);
    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("clients_list", onClientsList);
      socket.off("chat_history", onChatHistory);
      socket.off("new_message", onNewMessage);
    };
  }, [selectedClient]);

  useEffect(() => {
    if (selectedClient) {
      setUnreadCount((prev) => ({ ...prev, [selectedClient]: 0 }));
    }
    scrollToBottom();
  }, [selectedClient]);

  const sendReply = () => {
    if (!agentMsg.trim() || !selectedClient) return;
    
    // Check if socket is ready
    if (!socketRef.current) {
      console.warn("Socket not connected yet");
      return;
    }

    const msgObj = { from: "agent", text: agentMsg, time: Date.now() };

    // Send to backend
    socketRef.current.emit("agent_message", { clientId: selectedClient, message: agentMsg });

    // Update locally and save to localStorage
    setMessagesByClient((prev) => {
      const arr = prev[selectedClient] ? [...prev[selectedClient], msgObj] : [msgObj];
      localStorage.setItem(`agent_chat_${selectedClient}`, JSON.stringify(arr));
      return { ...prev, [selectedClient]: arr };
    });

    setAgentMsg("");
    scrollToBottom();
  };

  const selectClient = (clientId) => {
    setSelectedClient(clientId);
    setUnreadCount((prev) => ({ ...prev, [clientId]: 0 }));
    // Load stored messages if available
    const stored = localStorage.getItem(`agent_chat_${clientId}`);
    if (stored) {
      try {
        const loadedMessages = JSON.parse(stored);
        setMessagesByClient((prev) => ({ ...prev, [clientId]: loadedMessages }));
      } catch (e) {
        console.error("Failed to load stored messages:", e);
      }
    }
    setTimeout(scrollToBottom, 50);
  };

  const deleteChat = (clientId) => {
    if (window.confirm(`Are you sure you want to delete the chat with ${clientInfo[clientId]?.name || clientId}?`)) {
      // Remove from clients list
      setClients((prev) => prev.filter((c) => c !== clientId));
      
      // Remove messages for this client
      setMessagesByClient((prev) => {
        const updated = { ...prev };
        delete updated[clientId];
        return updated;
      });
      
      // Remove client info
      setClientInfo((prev) => {
        const updated = { ...prev };
        delete updated[clientId];
        return updated;
      });
      
      // Remove from unread count
      setUnreadCount((prev) => {
        const updated = { ...prev };
        delete updated[clientId];
        return updated;
      });
      
      // Clear localStorage
      localStorage.removeItem(`agent_chat_${clientId}`);
      
      // Clear selection if this was the selected client
      if (selectedClient === clientId) {
        setSelectedClient(null);
      }
      
      // Emit delete event to server
      socketRef.current.emit("delete_client_chat", { clientId });
      console.log("Chat deleted for client:", clientId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-green-600 text-white font-bold text-center">
          Active Chats ({clients.length})
        </div>
        <div className="overflow-y-auto flex-1">
          {clients.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No active chats</div>
          ) : (
            clients.map((clientId) => (
              <div
                key={clientId}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedClient === clientId ? 'bg-blue-50' : ''}`}
                onClick={() => selectClient(clientId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      {clientInfo[clientId]?.name?.charAt(0) || clientId.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-800">
                        {clientInfo[clientId]?.name || 'Guest User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {clientInfo[clientId]?.email || clientId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount[clientId] > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {unreadCount[clientId]}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(clientId);
                      }}
                      className="text-red-500 hover:text-red-700 text-lg px-2 py-1"
                      title="Delete chat"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="ml-13 mt-1 text-sm text-gray-600 truncate">
                  {messagesByClient[clientId]?.slice(-1)[0]?.text || "No messages yet"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                  {clientInfo[selectedClient]?.name?.charAt(0) || selectedClient.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h2 className="font-bold text-gray-800">
                    {clientInfo[selectedClient]?.name || 'Guest User'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {clientInfo[selectedClient]?.email || selectedClient}
                    {clientInfo[selectedClient]?.isGuest && ' (Guest)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {messagesByClient[selectedClient]?.map((msg, i) => (
                <div key={i} className={`flex mb-4 ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.from === "agent" ? "bg-green-100" : "bg-white"}`}>
                    <p className="text-gray-800">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={agentMsg}
                  onChange={(e) => setAgentMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                  placeholder="Type your reply..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={sendReply}
                  disabled={!agentMsg.trim()}
                  className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat from the sidebar to start messaging
          </div>
        )}
      </div>
    </div>
  );
}