import { format } from 'date-fns';
import { CheckCheck, Check, Clock } from 'lucide-react';

const MessageBubble = ({ message, replyTo }) => {
  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  };

  // Get status icon based on message status
  const getStatusIcon = () => {
    if (!message.status) return null;
    // WhatsApp status logic: sent (✓), delivered (✓✓), read (✓✓ blue), failed (❌), pending (🕓)
    switch (message.status) {
      case 'read':
        return <CheckCheck size={16} style={{color: '#53bdeb'}} title="Read" />;
      case 'delivered':
        return <CheckCheck size={16} style={{color: '#aebac1'}} title="Delivered" />;
      case 'sent':
        return <Check size={16} style={{color: '#aebac1'}} title="Sent" />;
      case 'failed':
        return <span style={{color: '#e53935', fontSize: 16}} title="Failed">❌</span>;
      case 'pending':
      default:
        return <Clock size={16} style={{color: '#aebac1'}} title="Pending" />;
    }
  };

  // Process message content - handle different message types if needed
  const renderMessageContent = () => {
    if (!message.content) return null;

    if (message.type === 'text' || !message.type) {
      return <div className="message-content">{message.content}</div>;
    }

    // Handle other message types in the future (images, audio, etc.)
    return <div className="message-content">{message.content}</div>;
  };

  return (
    <div 
      className={`message-bubble ${message.direction === 'outgoing' ? 'outgoing' : 'incoming'}`}
    >
      {/* Show replied-to message if present */}
      {replyTo && (
        <div className="reply-to-bubble" style={{
          background: message.direction === 'outgoing' ? '#f0f0f0' : '#e6f2ff',
          borderLeft: `4px solid ${message.direction === 'outgoing' ? '#53bdeb' : '#34b7f1'}`,
          padding: '6px 10px',
          marginBottom: '4px',
          borderRadius: '7px',
          fontSize: '13px',
          color: '#555',
          maxWidth: '90%',
          overflowWrap: 'break-word'
        }}>
          <span style={{ fontWeight: 500, color: message.direction === 'outgoing' ? '#53bdeb' : '#34b7f1', marginRight: 4 }}>↩️</span>
          <span style={{ fontWeight: 500 }}>{replyTo}</span>
        </div>
      )}
      {renderMessageContent()}
      
      <div className="message-meta">
        <span className="message-time">
          {formatMessageTime(message.timestamp)}
        </span>
        
        {message.direction === 'outgoing' && (
          <span className="message-status">
            {getStatusIcon()}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;