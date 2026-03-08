// src/components/ChatWidget/ChatWidget.jsx
import { useState, useEffect } from 'react';
import { useChat } from '../../hooks/useChat.js';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import ChatButton from './ChatButton.jsx';
import api from '../../utils/api.js';
import { DEFAULT_CONFIG } from '../../utils/constants.js';

export default function ChatWidget({ website, position = 'bottom-right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const { messages, sendMessage, isLoading, isTyping, clearMessages } = useChat(website, config);

  useEffect(() => {
    // Fetch client configuration
    const fetchConfig = async () => {
      try {
        const response = await api.get(`/chat/config/${website}`);
        if (response.success) {
          setConfig({ ...DEFAULT_CONFIG, ...response.config });
        }
      } catch (error) {
        console.error('Error fetching config:', error);
        // Use default config if API fails
        setConfig(DEFAULT_CONFIG);
      }
    };

    if (website) {
      fetchConfig();
    } else {
      // Use default config if no website
      setConfig(DEFAULT_CONFIG);
    }
  }, [website]);

  // Note: Welcome message is handled by the embed script or can be added via useChat hook
  // For React component, you can add it manually if needed

  const primaryColor = config.customStyles?.primaryColor || DEFAULT_CONFIG.primaryColor;
  const widgetPosition = config.customStyles?.position || position;

  return (
    <>
      {!isOpen && (
        <ChatButton
          onClick={() => setIsOpen(true)}
          isOpen={isOpen}
          primaryColor={primaryColor}
        />
      )}
      {isOpen && (
        <div
          className={`fixed ${widgetPosition === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'} z-50 w-full sm:w-96 h-[600px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div
            className="px-4 py-3 rounded-t-2xl flex items-center justify-between text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h3 className="font-semibold">Chat Support</h3>
            </div>
            <div className="flex items-center space-x-2">
              {/* New Conversation Button */}
              {messages.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Start a new conversation? This will clear the current chat history.')) {
                      clearMessages();
                    }
                  }}
                  className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                  aria-label="New conversation"
                  title="New conversation"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              )}
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <MessageList messages={messages} isTyping={isTyping} />

          {/* Input */}
          <MessageInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      )}
    </>
  );
}
