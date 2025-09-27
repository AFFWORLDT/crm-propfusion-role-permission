import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';

const ConversationSidebar = ({ 
  conversations, 
  loading, 
  error, 
  activeConversation,
  onSelectConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation => 
    conversation.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get initials from contact name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If message was today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    }
    
    // If message was yesterday, show "Yesterday"
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise show date
    return format(date, 'MM/dd/yyyy');
  };

  if (loading) {
    return (
      <div className="conversation-sidebar">
        <div className="sidebar-header">
          <h2>WhatsApp</h2>
        </div>
        <div className="search-container">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search contacts" 
              disabled
            />
          </div>
        </div>
        <div className="conversation-list">
          <div className="conversation-loading-container">
            <div className="chat-loading-spinner">
              <div className="chat-loading-bounce1"></div>
              <div className="chat-loading-bounce2"></div>
              <div className="chat-loading-bounce3"></div>
            </div>
            <p>Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-sidebar">
        <div className="sidebar-header">
          <h2>WhatsApp</h2>
        </div>
        <div className="error-state">
          <h3>Error Loading Conversations</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-sidebar">
      <div className="sidebar-header">
        <h2>WhatsApp</h2>
        <div className="sidebar-actions">
          {/* Icons and actions can be added here */}
        </div>
      </div>
      
      <div className="search-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search contacts" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="conversation-list">
        {filteredConversations.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px', textAlign: 'center' }}>
            <p>{searchQuery ? 'No matching contacts found' : 'No conversations available'}</p>
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <div 
              key={conversation._id} 
              className={`conversation-item ${activeConversation?._id === conversation._id ? 'active' : ''}`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="contact-avatar">
                {getInitials(conversation.contact_name)}
              </div>
              
              <div className="contact-info">
                <div className="contact-row">
                  <span className="contact-name">{conversation.contact_name || 'Unknown Contact'}</span>
                  <span className="message-time">{formatMessageTime(conversation.last_message)}</span>
                </div>
                
                <div className="latest-message">
                  {conversation.latest_message || 'No messages yet'}
                </div>
              </div>
              
              {conversation.message_count > 0 && (
                <div className="message-count">{conversation.message_count}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar; 