import { useState, useEffect, useCallback } from 'react';
import { fetchWhatsappConversations } from '../api/whatsappLogs';

/**
 * Custom hook to fetch and manage WhatsApp conversations
 * @param {Object} options - Options for fetching conversations
 * @returns {Object} - Conversations data and state
 */
const useWhatsAppConversations = (options = {}) => {
  const { initialPage = 1, pageSize = 10, sortBy = 'recent' } = options;
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  const fetchConversations = useCallback(async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWhatsappConversations({
        page: currentPage,
        size: pageSize,
        sort_by: sortBy
      });
      
      if (response && response.conversations) {
        setConversations(response.conversations);
        setTotalCount(response.total || 0);
        setHasNextPage(currentPage < response.pages);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching WhatsApp conversations:', err);
      setError(err.message || 'Failed to fetch WhatsApp conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy]);
  
  // Initial fetch
  useEffect(() => {
    const controller = new AbortController();
    
    fetchConversations(page);
    
    return () => {
      controller.abort();
    };
  }, [fetchConversations, page]);
  
  // Function to go to next page
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasNextPage]);
  
  // Function to go to previous page
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  }, [page]);
  
  // Function to reload data
  const refetch = useCallback(() => {
    fetchConversations(page);
  }, [fetchConversations, page]);
  
  return {
    conversations,
    loading,
    error,
    totalCount,
    page,
    hasNextPage,
    hasPrevPage: page > 1,
    nextPage,
    prevPage,
    refetch
  };
};

export default useWhatsAppConversations; 