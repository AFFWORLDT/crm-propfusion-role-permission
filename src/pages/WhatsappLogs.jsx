import { useState, useEffect } from 'react';
import { getWhatsappLogs } from '../api/whatsappLogs';
import { format, addHours, formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import '../styles/WhatsappLogs.css';

const WhatsappLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWhatsappLogs({ 
          page, 
          size: 100,
          sort_order: 'DESC'
        }, controller.signal);
        
        console.log('Component received data:', data);
        
        if (isSubscribed) {
          if (data.logs && Array.isArray(data.logs)) {
            setLogs(data.logs);
            setTotalCount(data.count || 0);
            console.log('Setting logs:', data.logs);
          } else {
            console.error('Invalid logs data:', data);
            setError('Invalid data format received');
          }
        }
      } catch (err) {
        console.error('Error in fetchLogs:', err);
        if (isSubscribed && err.name !== 'AbortError') {
          setError(err.message);
          setLogs([]);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="whatsapp-logs-container">
        <div className="error-message">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!logs || !logs.length) {
    return (
      <div className="whatsapp-logs-container">
        <div className="empty-state">
          <h3>No WhatsApp Logs Found</h3>
          <p>No data available to display.</p>
        </div>
      </div>
    );
  }

  // Function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const gmt4Date = addHours(date, 4);
    
    const formattedDate = format(gmt4Date, 'dd MMM yyyy'); // Format: 17 Mar 2024
    const formattedTime = format(gmt4Date, 'h:mm a'); // Format: 8:15 PM
    const timeAgo = formatDistanceToNow(gmt4Date, { addSuffix: true }); // Format: 2 hours ago
    
    return (
      <div className="datetime-cell">
        <div className="date">{formattedDate}</div>
        <div className="time">{formattedTime}</div>
        <div className="time-ago">{timeAgo}</div>
      </div>
    );
  };

  return (
    <div className="whatsapp-logs-container">
      <div className="whatsapp-logs-header">
        <h1>WhatsApp Logs</h1>
      </div>

      <div className="whatsapp-logs-card">
        <div className="whatsapp-logs-table-container">
          <table className="whatsapp-logs-table">
            <thead>
              <tr>
                <th>Sent At</th>
                <th>Recipient</th>
                <th>Template</th>
                <th>Portal</th>
                <th>Status</th>
                <th>Agent</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{formatDateTime(log.sent_at)}</td>
                  <td>{log.recipient}</td>
                  <td>{log.template_name}</td>
                  <td>{log.portal_name}</td>
                  <td>
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="agent-cell">
                    {log.agent ? (
                      <div className="agent-info">
                        {log.agent.avatar && (
                          <img 
                            src={log.agent.avatar} 
                            alt={log.agent.name} 
                            className="agent-avatar"
                          />
                        )}
                        <div className="agent-details">
                          <div className="agent-name">{log.agent.name}</div>
                          <div className="agent-id">ID: {log.agent.id}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="no-agent">No Agent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <div className="pagination-info">
            Showing {(page - 1) * 100 + 1} to {Math.min(page * 100, totalCount)} of {totalCount} results
          </div>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * 100 >= totalCount}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsappLogs; 