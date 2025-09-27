import { useState, useEffect, useCallback } from 'react';
import { fetchWhatsappConversationMessages } from '../api/whatsappLogs';

/**
 * Custom hook to fetch and manage WhatsApp messages for a conversation
 * @param {string} phoneNumber - The phone number to fetch messages for
 * @param {Object} options - Options for fetching messages
 * @returns {Object} - Messages data and state
 */
const useWhatsAppMessages = (phoneNumber, options = {}) => {
  const { limit = 50 } = options;
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contact, setContact] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  
  const fetchMessages = useCallback(async () => {
    if (!phoneNumber) {
      setMessages([]);
      setLoading(false);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWhatsappConversationMessages(phoneNumber, { limit });
      
      if (response) {
        setMessages(response.messages || []);
        setContact(response.contact || null);
        setHasMore(response.has_more || false);
        setTotal(response.total || 0);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(`Error fetching WhatsApp messages for ${phoneNumber}:`, err);
      setError(err.message || 'Failed to fetch WhatsApp messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, limit]);
  
  // Fetch messages when phone number changes
  useEffect(() => {
    const controller = new AbortController();
    
    if (phoneNumber) {
      fetchMessages();
    } else {
      setMessages([]);
      setLoading(false);
      setError(null);
    }
    
    return () => {
      controller.abort();
    };
  }, [fetchMessages, phoneNumber]);
  
  return {
    messages,
    loading,
    error,
    contact,
    hasMore,
    total,
    refetch: fetchMessages
  };
};

export default useWhatsAppMessages; 