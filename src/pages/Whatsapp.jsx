import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import ConversationSidebar from '../components/WhatsApp/ConversationSidebar';
import ChatWindow from '../components/WhatsApp/ChatWindow';
import useWhatsAppConversations from '../hooks/useWhatsAppConversations';
import useWhatsAppMessages from '../hooks/useWhatsAppMessages';
import '../styles/WhatsAppChat.css';

const Whatsapp = () => {
  // State for tracking the selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Check if mobile view
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [showChat, setShowChat] = useState(false);
  
  // Fetch conversations
  const { 
    conversations, 
    loading: conversationsLoading, 
    error: conversationsError,
    refetch: refetchConversations
  } = useWhatsAppConversations();
  
  // Fetch messages for selected conversation
  const { 
    messages, 
    loading: messagesLoading, 
    error: messagesError, 
    refetch: refetchMessages 
  } = useWhatsAppMessages(selectedConversation?.phone);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    if (isMobile) {
      setShowChat(true);
    }
  };
  
  // Handle back button in mobile view
  const handleBack = () => {
    if (isMobile) {
      setShowChat(false);
    }
  };
  
  // Handle message sent event
  const handleMessageSent = (tempMessage) => {
    // If a temporary message is provided, we could add it to a local state
    // before the API refresh to give immediate feedback
    if (tempMessage && messages) {
      // Could implement optimistic UI update here if needed
      console.log('Temporary message before refresh:', tempMessage);
    }
    
    // Refetch both conversations and messages
    refetchMessages();
    refetchConversations();
  };
  
  // Set up classes for mobile view
  const sidebarClass = isMobile && showChat 
    ? 'conversation-sidebar hidden' 
    : 'conversation-sidebar';
  
  const chatContainerClass = isMobile 
    ? `chat-container ${showChat ? 'active' : ''}` 
    : 'chat-container';

  return (
    <div className="whatsapp-container">
      <div className={sidebarClass}>
        <ConversationSidebar
          conversations={conversations}
          loading={conversationsLoading}
          error={conversationsError}
          activeConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      
      <div className={chatContainerClass}>
        <ChatWindow
          conversation={selectedConversation}
          messages={messages}
          loading={messagesLoading}
          error={messagesError}
          onBack={handleBack}
          onMessageSent={handleMessageSent}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default Whatsapp; 