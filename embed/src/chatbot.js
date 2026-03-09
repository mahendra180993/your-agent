// embed/src/chatbot.js
(function() {
  'use strict';

  // Configuration - can be overridden by window.CHATBOT_CONFIG
  const CONFIG = {
    apiBaseUrl: (window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.apiBaseUrl) || 'https://your-backend-url.com/api',
    position: (window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.position) || 'bottom-right',
    primaryColor: (window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.primaryColor) || '#007bff',
    zIndex: (window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.zIndex) || 9999,
    title: (window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.title) || 'Chat Support',
    logoUrl: (window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.logoUrl) || '',
  };

  // Get website from current domain
  const getWebsite = () => {
    return window.location.hostname || 'example.com';
  };

  // Generate or get session ID
  const getSessionId = () => {
    const host = window.location.hostname || 'default';
    const key = `chatbot_session_id_${host}`;
    let sessionId = localStorage.getItem(key);
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(key, sessionId);
    }
    return sessionId;
  };

  // Load messages from localStorage
  const loadMessages = () => {
    const host = window.location.hostname || 'default';
    const key = `chatbot_messages_${host}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  };

  // Save messages to localStorage
  const saveMessages = (messages) => {
    const host = window.location.hostname || 'default';
    const key = `chatbot_messages_${host}`;
    localStorage.setItem(key, JSON.stringify(messages));
  };

  // Create chatbot widget
  const createChatbot = () => {
    const website = getWebsite();
    let sessionId = getSessionId();
    let messages = loadMessages();
    let isOpen = false;
    let isLoading = false;
    let isTyping = false;
    let contactFormSubmitted = false;

    // Create container
    const container = document.createElement('div');
    container.id = 'ai-chatbot-container';
    document.body.appendChild(container);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #ai-chatbot-container {
        position: fixed;
        ${CONFIG.position === 'bottom-right' ? 'bottom: 24px; right: 24px;' : 'bottom: 24px; left: 24px;'}
        z-index: ${CONFIG.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        --chat-primary: ${CONFIG.primaryColor};
      }
      .chatbot-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: var(--chat-primary);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .chatbot-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      }
      .chatbot-button svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
      .chatbot-button-logo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }
      .chatbot-widget {
        position: fixed;
        ${CONFIG.position === 'bottom-right' ? 'bottom: 24px; right: 24px;' : 'bottom: 24px; left: 24px;'}
        width: 90vw;
        max-width: 384px;
        height: 600px;
        max-height: 90vh;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: ${CONFIG.zIndex};
        animation: slideUp 0.3s ease-out;
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .chatbot-header {
        background-color: var(--chat-primary);
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .chatbot-header-main {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .chatbot-logo {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        background: rgba(255,255,255,0.1);
      }
      .chatbot-header-text {
        display: flex;
        flex-direction: column;
      }
      .chatbot-header-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .chatbot-header-subtitle {
        font-size: 12px;
        opacity: 0.9;
      }
      .chatbot-header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .chatbot-new-chat {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
      }
      .chatbot-new-chat:hover {
        background: rgba(255,255,255,0.2);
      }
      .chatbot-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
      }
      .chatbot-close:hover {
        background: rgba(255,255,255,0.2);
      }
      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f9fafb;
      }
      .chatbot-message {
        margin-bottom: 16px;
        display: flex;
      }
      .chatbot-message.user {
        justify-content: flex-end;
      }
      .chatbot-message.bot {
        justify-content: flex-start;
      }
      .chatbot-message-content {
        max-width: 75%;
        padding: 12px 16px;
        border-radius: 18px;
        word-wrap: break-word;
      }
      .chatbot-message.user .chatbot-message-content {
        background-color: var(--chat-primary);
        color: white;
        border-bottom-right-radius: 4px;
      }
      .chatbot-message.bot .chatbot-message-content {
        background-color: white;
        color: #1f2937;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      .chatbot-input-container {
        border-top: 1px solid #e5e7eb;
        padding: 16px;
        background: white;
      }
      .chatbot-input-wrapper {
        display: flex;
        gap: 8px;
      }
      .chatbot-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        color: #1f2937;
        background-color: #fff;
      }
      .chatbot-input::placeholder {
        color: #6b7280;
      }
      .chatbot-input:focus {
        border-color: var(--chat-primary);
      }
      .chatbot-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--chat-primary);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
      }
      .typing-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #9ca3af;
        animation: bounce 1.4s infinite;
      }
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes bounce {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-10px);
        }
      }
      @media (max-width: 640px) {
        .chatbot-widget {
          width: 100vw;
          height: 100vh;
          max-height: 100vh;
          border-radius: 0;
          bottom: 0;
          ${CONFIG.position === 'bottom-right' ? 'right: 0;' : 'left: 0;'}
        }
      }
    `;
    document.head.appendChild(style);

    // Create button
    const button = document.createElement('button');
    button.className = 'chatbot-button';
    button.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    `;
    button.addEventListener('click', () => {
      isOpen = true;
      render();
    });

    // Create widget
    const widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.style.display = 'none';

    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.innerHTML = `
      <div class="chatbot-header-main">
        ${CONFIG.logoUrl
          ? `<img src="${CONFIG.logoUrl}" alt="Chatbot logo" class="chatbot-logo" />`
          : `<div class="chatbot-logo" aria-hidden="true"></div>`}
        <div class="chatbot-header-text">
          <div class="chatbot-header-title">${CONFIG.title}</div>
          <div class="chatbot-header-subtitle">Online</div>
        </div>
      </div>
      <div class="chatbot-header-actions">
        <button class="chatbot-new-chat" aria-label="New conversation" title="New conversation">⟳</button>
        <button class="chatbot-close" aria-label="Close">×</button>
      </div>
    `;
    header.querySelector('.chatbot-close').addEventListener('click', () => {
      isOpen = false;
      render();
    });
    const newChatButton = header.querySelector('.chatbot-new-chat');
    if (newChatButton) {
      newChatButton.addEventListener('click', () => {
        messages = [];
        // Clear stored conversation and session so a fresh chat starts
        const host = window.location.hostname || 'default';
        localStorage.removeItem(`chatbot_messages_${host}`);
        localStorage.removeItem(`chatbot_session_id_${host}`);
        sessionId = getSessionId();
        render();
      });
    }

    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'chatbot-messages';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'chatbot-input-container';
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'chatbot-input-wrapper';
    const input = document.createElement('input');
    input.className = 'chatbot-input';
    input.type = 'text';
    input.placeholder = 'Type your message...';
    const sendButton = document.createElement('button');
    sendButton.className = 'chatbot-send';
    sendButton.innerHTML = '→';
    sendButton.disabled = true;

    input.addEventListener('input', () => {
      sendButton.disabled = !input.value.trim() || isLoading;
    });

    const sendMessage = async () => {
      const message = input.value.trim();
      if (!message || isLoading) return;

      // Add user message
      messages.push({
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      });
      input.value = '';
      sendButton.disabled = true;
      render();

      isLoading = true;
      isTyping = true;
      render();

      try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/chat/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            website,
            sessionId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          messages.push({
            id: Date.now() + 1,
            text: data.reply,
            sender: 'bot',
            timestamp: new Date(),
          });
        } else {
          messages.push({
            id: Date.now() + 1,
            text: data.error || 'Sorry, something went wrong.',
            sender: 'bot',
            timestamp: new Date(),
          });
        }
      } catch (error) {
        messages.push({
          id: Date.now() + 1,
          text: 'Sorry, I\'m having trouble connecting. Please try again later.',
          sender: 'bot',
          timestamp: new Date(),
        });
      } finally {
        isLoading = false;
        isTyping = false;
        render();
      }
    };

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendButton.addEventListener('click', sendMessage);

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(sendButton);
    inputContainer.appendChild(inputWrapper);

    widget.appendChild(header);
    widget.appendChild(messagesContainer);
    widget.appendChild(inputContainer);

    const render = () => {
      if (isOpen) {
        button.style.display = 'none';
        widget.style.display = 'flex';
        container.appendChild(widget);
      } else {
        button.style.display = 'flex';
        widget.style.display = 'none';
        container.appendChild(button);
      }

      messagesContainer.innerHTML = '';
      messages.forEach((msg) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${msg.sender}`;
        const content = document.createElement('div');
        content.className = 'chatbot-message-content';
        const needsContactForm =
          msg.sender === 'bot' && msg.text && msg.text.includes('[[CONTACT_FORM]]');
        const cleanText = needsContactForm
          ? msg.text.replace('[[CONTACT_FORM]]', '').trim()
          : msg.text;
        content.textContent = cleanText;
        messageDiv.appendChild(content);
        messagesContainer.appendChild(messageDiv);

        // Render contact details form once, when requested by bot
        if (needsContactForm && !contactFormSubmitted) {
          renderContactForm(messagesContainer);
        }
      });

      if (isTyping) {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingDiv);
      }

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      saveMessages(messages);
    };

    const renderContactForm = (parent) => {
      const formWrapper = document.createElement('div');
      formWrapper.style.marginTop = '8px';

      const form = document.createElement('form');
      form.style.display = 'flex';
      form.style.flexDirection = 'column';
      form.style.gap = '8px';
      form.style.padding = '12px 16px';
      form.style.background = '#f3f4f6';
      form.style.borderRadius = '12px';

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'Your name';
      nameInput.style.padding = '8px 10px';
      nameInput.style.borderRadius = '8px';
      nameInput.style.border = '1px solid #d1d5db';

      const phoneInput = document.createElement('input');
      phoneInput.type = 'tel';
      phoneInput.placeholder = 'Phone number';
      phoneInput.style.padding = '8px 10px';
      phoneInput.style.borderRadius = '8px';
      phoneInput.style.border = '1px solid #d1d5db';

      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.placeholder = 'Email address';
      emailInput.style.padding = '8px 10px';
      emailInput.style.borderRadius = '8px';
      emailInput.style.border = '1px solid #d1d5db';

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Send details';
      submitBtn.style.padding = '8px 12px';
      submitBtn.style.borderRadius = '9999px';
      submitBtn.style.border = 'none';
      submitBtn.style.cursor = 'pointer';
      submitBtn.style.alignSelf = 'flex-start';
      submitBtn.style.backgroundColor = CONFIG.primaryColor;
      submitBtn.style.color = '#fff';

      form.appendChild(nameInput);
      form.appendChild(phoneInput);
      form.appendChild(emailInput);
      form.appendChild(submitBtn);
      formWrapper.appendChild(form);
      parent.appendChild(formWrapper);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();

        if (!name || !phone || !email) {
          alert('Please fill in name, phone, and email.');
          return;
        }

        contactFormSubmitted = true;

        messages.push({
          id: Date.now(),
          text: `Contact details provided - Name: ${name}, Phone: ${phone}, Email: ${email}`,
          sender: 'user',
          timestamp: new Date(),
        });
        render();
      });
    };

    // Initial render
    render();

    // Fetch per-client config (from admin) and apply welcome message + styles/title/logo if available
    fetch(`${CONFIG.apiBaseUrl}/chat/config/${website}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success || !data.config) return;

        const cfg = data.config;

        // Apply styles from backend if provided (admin customizations)
        if (cfg.customStyles && cfg.customStyles.primaryColor) {
          CONFIG.primaryColor = cfg.customStyles.primaryColor;
          // Update CSS variable so all parts (header, button, bubbles) use the new color,
          // including existing history messages.
          const hostContainer = document.getElementById('ai-chatbot-container');
          if (hostContainer) {
            hostContainer.style.setProperty('--chat-primary', CONFIG.primaryColor);
          }
          // Keep button/send inline color in sync as well
          button.style.backgroundColor = CONFIG.primaryColor;
          sendButton.style.backgroundColor = CONFIG.primaryColor;
        }

        // Apply header title / logo from backend if provided
        if (cfg.headerTitle) {
          const titleEl = header.querySelector('.chatbot-header-title');
          if (titleEl) titleEl.textContent = cfg.headerTitle;
        }
        if (cfg.logoUrl) {
          const logoEl = header.querySelector('.chatbot-logo');
          if (logoEl && logoEl.tagName === 'IMG') {
            logoEl.src = cfg.logoUrl;
          }
          // Also update the floating chat button to show the client logo
          button.innerHTML = `<img src="${cfg.logoUrl}" alt="Open chat" class="chatbot-button-logo" />`;
        }

        // Show welcome message (auto-greet)
        if (cfg.welcomeMessage) {
          setTimeout(() => {
            if (messages.length === 0) {
              messages.push({
                id: Date.now(),
                text: cfg.welcomeMessage,
                sender: 'bot',
                timestamp: new Date(),
              });
              render();
            }
          }, cfg.autoGreetDelay || 5000);
        }
      })
      .catch(() => {
        // Silently fail
      });
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
  } else {
    createChatbot();
  }
})();
