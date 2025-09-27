import React, { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, X } from 'lucide-react';
import './VoiceConversionWidget.css';

// Hardcoded ElevenLabs Agent ID
const AGENT_ID = 'agent_9201k2h368gxexcs036detdy19an'; // <-- Replace with your actual agent ID

const VoiceConversionWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      console.log('Voice conversion connected');
    },
    onDisconnect: () => {
      setIsConnected(false);
      setIsSpeaking(false);
      console.log('Voice conversion disconnected');
    },
    onMessage: (message) => {
      setMessages(prev => [...prev, message]);
      console.log('Voice message:', message);
    },
    onError: (error) => {
      console.error('Voice conversion error:', error);
    }
  });

  const handleStartSession = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const conversationId = await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'webrtc',
        user_id: `user_${Date.now()}`,
      });
      console.log('Conversation started with ID:', conversationId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      if (error.name === 'NotAllowedError') {
        alert('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else {
        alert('Failed to connect to ElevenLabs. Please check your internet connection.');
      }
    }
  };

  const handleEndSession = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="voice-conversion-widget">
      {/* Floating Action Button */}
      <button 
        className={`voice-fab ${isConnected ? 'connected' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={toggleWidget}
        title="Voice Conversion"
      >
        {isSpeaking ? (
          <div className="speaking-indicator">
            <div className="pulse"></div>
            <Mic className="icon" />
          </div>
        ) : isConnected ? (
          <Mic className="icon" />
        ) : (
          <MicOff className="icon" />
        )}
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="voice-widget-panel">
          <div className="widget-header">
            <h3>Voice Conversion</h3>
            <button 
              className="close-btn"
              onClick={toggleWidget}
            >
              <X size={16} />
            </button>
          </div>

          <div className="widget-content">
            <div className="status-section">
              <div className="status-indicator">
                <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              {isSpeaking && (
                <div className="speaking-status">
                  <span>Agent is speaking...</span>
                </div>
              )}
            </div>

            <div className="controls-section">
              {!isConnected ? (
                <button 
                  className="start-btn"
                  onClick={handleStartSession}
                >
                  <Mic size={16} />
                  Start Conversation
                </button>
              ) : (
                <button 
                  className="stop-btn"
                  onClick={handleEndSession}
                >
                  <MicOff size={16} />
                  End Conversation
                </button>
              )}
            </div>

            {/* Messages Log */}
            {messages.length > 0 && (
              <div className="messages-section">
                <h4>Recent Messages</h4>
                <div className="messages-list">
                  {messages.slice(-5).map((message, index) => (
                    <div key={index} className="message-item">
                      <span className="message-type">{message.type}:</span>
                      <span className="message-text">{message.text || message.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceConversionWidget; 