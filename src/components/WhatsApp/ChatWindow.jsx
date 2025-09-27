import { useState, useRef, useEffect } from 'react';
import { format, addHours, parseISO } from 'date-fns';
import { Send, ChevronLeft, Paperclip, Smile } from 'lucide-react';
import { sendWhatsappMessage, markWhatsappMessageRead } from '../../api/whatsappLogs';
import MessageBubble from './MessageBubble';
import whatsapp from "../../assets/whatsapp.svg";

const ChatWindow = ({ 
  conversation, 
  messages, 
  loading, 
  error, 
  onBack, 
  onMessageSent,
  isMobile = false
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [readMessages, setReadMessages] = useState({}); // Track which messages have been marked read
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Format timestamp for display with Dubai time (+4 hours)
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = parseISO(timestamp);
    const dubaiTime = addHours(date, 4); // Add 4 hours for Dubai time
    return format(dubaiTime, 'h:mm a');
  };

  // Group messages by date for date dividers
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = parseISO(message.timestamp);
      const dubaiTime = addHours(date, 4); // Add 4 hours for Dubai time
      const dateKey = format(dubaiTime, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  // Format date for display in dividers
  const formatDateDivider = (dateKey) => {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || sending) return;
    
    try {
      setSending(true);
      const response = await sendWhatsappMessage(conversation.phone, messageInput.trim(), 'text');
      console.log('Message sent successfully:', response);
      setMessageInput('');
      
      // If the API was successful, add the new message to the local state temporarily
      // This gives immediate feedback to the user before the next refresh
      if (response.success) {
        // Create a temporary message object
        const tempMessage = {
          id: response.message_id || response.wamid || `temp-${Date.now()}`,
          content: messageInput.trim(),
          direction: 'outgoing',
          timestamp: new Date().toISOString(),
          status: 'sent'
        };
        
        // If a callback is provided, notify parent component that a message was sent
        if (onMessageSent) {
          onMessageSent(tempMessage);
        }
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Could show a toast notification here
    } finally {
      setSending(false);
    }
  };

  // Mark unread incoming messages as read when they appear in the viewport
  useEffect(() => {
    if (!messages || !conversation) return;
    const unreadIncoming = messages.filter(
      (msg) =>
        msg.direction === 'incoming' &&
        msg.status !== 'read' &&
        !readMessages[msg.id] &&
        msg.processed !== true // Only mark as read if not already processed
    );
    if (unreadIncoming.length === 0) return;
    unreadIncoming.forEach(async (msg) => {
      try {
        await markWhatsappMessageRead(msg.id);
        setReadMessages((prev) => ({ ...prev, [msg.id]: true }));
        // Optionally, update the message status in parent state if needed
      } catch (e) {
        // Optionally handle error
      }
    });
  }, [messages, conversation]);

  // If no conversation is selected, show empty state
  if (!conversation) {
    return (
      <div className="chat-container">
        <div className="empty-chat">

            <img src={whatsapp} alt="WhatsApp Logo" style={{ height: '100px', width: '100px' }} />

          <h3>WhatsApp Web</h3>
          <p>
            Select a conversation from the list to start messaging.
            <br />
            Your messages are synchronized with your phone.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          {isMobile && (
            <button className="chat-action-btn back-button" onClick={onBack}>
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="chat-contact-info">
            <div className="contact-avatar">
              {conversation.contact_name ? conversation.contact_name.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="chat-contact-name">
              {conversation.contact_name || 'Unknown Contact'}
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                {conversation.phone}
              </div>
            </span>
          </div>
        </div>
        <div className="chat-messages">
          <div className="chat-loading-container">
            <div className="chat-loading-spinner">
              <div className="chat-loading-bounce1"></div>
              <div className="chat-loading-bounce2"></div>
              <div className="chat-loading-bounce3"></div>
            </div>
            <p>Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          {isMobile && (
            <button className="chat-action-btn back-button" onClick={onBack}>
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="chat-contact-info">
            <div className="contact-avatar">
              {conversation.contact_name ? conversation.contact_name.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="chat-contact-name">
              {conversation.contact_name || 'Unknown Contact'}
            </span>
          </div>
        </div>
        <div className="error-state">
          <h3>Error Loading Messages</h3>
          <p>{error}</p>
          <button onClick={onMessageSent}>Retry</button>
        </div>
      </div>
    );
  }

  // Group messages by date and sort in descending order for each date
  const messagesByDate = groupMessagesByDate(messages || []);
  const sortedDates = Object.keys(messagesByDate).sort((a, b) => new Date(a) - new Date(b));
  
  // Sort messages within each date group in ascending order
  sortedDates.forEach(dateKey => {
    messagesByDate[dateKey].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  });

  return (
    <div className="chat-container">
      <div className="chat-header">
        {isMobile && (
          <button className="chat-action-btn back-button" onClick={onBack}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="chat-contact-info">
          <div className="contact-avatar">
            {conversation.contact_name ? conversation.contact_name.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="chat-contact-name">
            {conversation.contact_name || 'Unknown Contact'}
            <div style={{ fontSize: '12px', color: '#667781' }}>
              {conversation.phone}
            </div>
          </span>
        </div>
        
        <div className="chat-actions">
          {/* Additional actions could be added here */}
        </div>
      </div>
      
      <div className="chat-messages">
        {sortedDates.map(dateKey => (
          <div key={dateKey}>
            <div className="chat-date-divider text-center">
              {formatDateDivider(dateKey)}
            </div>
            
            {messagesByDate[dateKey].map(message => {
              // Find the replied-to message content
              let replyTo = message.reply_to_content;
              if (!replyTo && message.in_reply_to) {
                // Try to find the original message by ID
                const originalMsg = (messages || []).find(m => m.id === message.in_reply_to);
                if (originalMsg && originalMsg.content) {
                  replyTo = originalMsg.content;
                }
              }
              return (
                <MessageBubble 
                  key={message.id} 
                  message={{
                    ...message,
                    timestamp: addHours(parseISO(message.timestamp), 4).toISOString() // Add Dubai time
                  }} 
                  replyTo={replyTo}
                />
              );
            })}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input-container">
        <div className="chat-input-box">
          <button type="button" className="chat-input-action">
            <Smile size={24} />
          </button>
          
          <button type="button" className="chat-input-action">
            <Paperclip size={24} />
          </button>
          
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={sending}
          />
        </div>
        
        <button 
          type="submit" 
          className="send-btn"
          disabled={!messageInput.trim() || sending}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;