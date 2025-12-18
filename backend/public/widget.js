(function () {
  const botId = document.currentScript.getAttribute("data-bot-id");
  const apiUrl = document.currentScript.getAttribute("data-api-url") || "http://localhost:3000";

  // Inject styles
  const styles = `
    .chatbot-widget * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .chatbot-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }

    .chatbot-bubble {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }

    .chatbot-bubble:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .chatbot-bubble svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    .chatbot-bubble.active svg.chat-icon {
      display: none;
    }

    .chatbot-bubble svg.close-icon {
      display: none;
    }

    .chatbot-bubble.active svg.close-icon {
      display: block;
    }

    .chatbot-notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      background: #ef4444;
      border-radius: 10px;
      display: none;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: bold;
      border: 2px solid white;
    }

    .chatbot-notification-badge.show {
      display: flex;
    }

    .chatbot-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 600px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s ease;
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

    .chatbot-window.open {
      display: flex;
    }

    .chatbot-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chatbot-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chatbot-avatar {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .chatbot-header-text h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .chatbot-status {
      font-size: 12px;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .chatbot-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: #10b981;
      animation: pulse 2s ease infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .chatbot-close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
      padding: 5px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .chatbot-close-btn:hover {
      opacity: 1;
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f9fafb;
      scroll-behavior: smooth;
    }

    .chatbot-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chatbot-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chatbot-messages::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    .chatbot-message {
      margin-bottom: 16px;
      display: flex;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .chatbot-message.user {
      justify-content: flex-end;
    }

    .chatbot-message-content {
      max-width: 75%;
      padding: 12px 16px;
      border-radius: 12px;
      word-wrap: break-word;
    }

    .chatbot-message.bot .chatbot-message-content {
      background: white;
      color: #1f2937;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .chatbot-message.user .chatbot-message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .chatbot-message-time {
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.6;
    }

    .chatbot-typing {
      display: none;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background: white;
      border-radius: 12px;
      width: fit-content;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .chatbot-typing.show {
      display: flex;
    }

    .chatbot-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: #9ca3af;
      animation: typing 1.4s ease infinite;
    }

    .chatbot-typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .chatbot-typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }

    .chatbot-welcome {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }

    .chatbot-welcome-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .chatbot-welcome h4 {
      font-size: 18px;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .chatbot-welcome p {
      font-size: 14px;
      line-height: 1.5;
    }

    .chatbot-input-area {
      padding: 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }

    .chatbot-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 24px;
      padding: 12px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .chatbot-input:focus {
      border-color: #667eea;
    }

    .chatbot-input::placeholder {
      color: #9ca3af;
    }

    .chatbot-send-btn {
      width: 44px;
      height: 44px;
      border-radius: 22px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, opacity 0.2s;
    }

    .chatbot-send-btn:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .chatbot-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chatbot-send-btn svg {
      width: 20px;
      height: 20px;
      fill: white;
    }

    .chatbot-error {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      margin: 8px;
    }

    @media (max-width: 480px) {
      .chatbot-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);
        bottom: 90px;
        right: 10px;
      }

      .chatbot-widget {
        bottom: 10px;
        right: 10px;
      }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create widget HTML
  const widget = document.createElement("div");
  widget.className = "chatbot-widget";
  widget.innerHTML = `
    <div class="chatbot-bubble" id="chatbot-toggle">
      <svg class="chat-icon" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
      </svg>
      <svg class="close-icon" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
      <div class="chatbot-notification-badge" id="chatbot-badge">1</div>
    </div>

    <div class="chatbot-window" id="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-header-text">
            <h3>AI Assistant</h3>
            <div class="chatbot-status">
              <span class="chatbot-status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
        <button class="chatbot-close-btn" id="chatbot-close">×</button>
      </div>

      <div class="chatbot-messages" id="chatbot-messages">
        <div class="chatbot-welcome">
          <div class="chatbot-welcome-icon">👋</div>
          <h4>Welcome!</h4>
          <p>Hi there! How can I help you today?</p>
        </div>
      </div>

      <div class="chatbot-typing" id="chatbot-typing">
        <div class="chatbot-typing-dot"></div>
        <div class="chatbot-typing-dot"></div>
        <div class="chatbot-typing-dot"></div>
      </div>

      <div class="chatbot-input-area">
        <input 
          type="text" 
          class="chatbot-input" 
          id="chatbot-input" 
          placeholder="Type your message..."
          autocomplete="off"
        />
        <button class="chatbot-send-btn" id="chatbot-send">
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  // State
  let isOpen = false;
  let messageCount = 0;

  // Elements
  const bubble = document.getElementById("chatbot-toggle");
  const chatWindow = document.getElementById("chatbot-window");
  const closeBtn = document.getElementById("chatbot-close");
  const messagesContainer = document.getElementById("chatbot-messages");
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("chatbot-send");
  const typingIndicator = document.getElementById("chatbot-typing");
  const badge = document.getElementById("chatbot-badge");

  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    bubble.classList.toggle("active", isOpen);
    chatWindow.classList.toggle("open", isOpen);
    
    if (isOpen) {
      input.focus();
      badge.classList.remove("show");
      messageCount = 0;
    }
  }

  bubble.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", toggleChat);

  // Format time
  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  // Add message to chat
  function addMessage(text, isUser = false) {
    const welcomeMsg = messagesContainer.querySelector(".chatbot-welcome");
    if (welcomeMsg) {
      welcomeMsg.remove();
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `
      <div class="chatbot-message-content">
        ${text}
        <div class="chatbot-message-time">${formatTime()}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (!isUser && !isOpen) {
      messageCount++;
      badge.textContent = messageCount;
      badge.classList.add("show");
    }
  }

  // Show/hide typing indicator
  function setTyping(show) {
    typingIndicator.classList.toggle("show", show);
    if (show) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Send message
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    input.value = "";
    sendBtn.disabled = true;

    try {
      // Show typing indicator
      setTyping(true);

      const response = await fetch(`${apiUrl}/api/bots/chat-with-bot`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicBotId: botId,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from bot");
      }

      const data = await response.json();
      
      // Simulate typing delay for better UX
      console.log("Bot response data:", data.response);
        setTyping(false);
        addMessage(data.response);
        

    } catch (error) {
      setTyping(false);
      console.error("Chatbot error:", error);
      
      const errorDiv = document.createElement("div");
      errorDiv.className = "chatbot-error";
      errorDiv.textContent = "Sorry, something went wrong. Please try again.";
      messagesContainer.appendChild(errorDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Event listeners
  sendBtn.addEventListener("click", sendMessage);
  
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  input.addEventListener("input", () => {
    sendBtn.disabled = !input.value.trim();
  });

  // Initialize
  sendBtn.disabled = true;

})();
