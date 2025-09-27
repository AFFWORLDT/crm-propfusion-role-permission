// ElevenLabs Configuration
// This file contains configuration for ElevenLabs voice conversion functionality

export const ELEVENLABS_CONFIG = {
  // Default settings
  DEFAULT_VOLUME: 0.7,
  DEFAULT_CONNECTION_TYPE: 'webrtc',
  
  // Local storage keys
  STORAGE_KEYS: {
    AGENT_ID: 'agent_9201k2h368gxexcs036detdy19an',
    VOLUME: '1',
  },
  
  // Instructions for setting up Agent ID
  SETUP_INSTRUCTIONS: {
    TITLE: 'How to set up ElevenLabs Voice Conversion',
    STEPS: [
      '1. Go to https://elevenlabs.io and create an account',
      '2. Navigate to the Conversational AI section',
      '3. Create a new agent or use an existing one',
      '4. Copy your Agent ID from the agent settings',
      '5. Paste the Agent ID in the settings below',
      '6. Click "Save" to store your configuration',
    ],
    NOTE: 'Your Agent ID will be stored locally in your browser for security.',
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NO_AGENT_ID: 'Please set your ElevenLabs Agent ID in settings',
    MICROPHONE_ACCESS: 'Microphone access is required for voice conversion',
    CONNECTION_FAILED: 'Failed to connect to ElevenLabs. Please check your Agent ID and internet connection.',
    PERMISSION_DENIED: 'Microphone permission denied. Please allow microphone access in your browser settings.',
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    AGENT_ID_SAVED: 'Agent ID saved successfully!',
    CONNECTION_ESTABLISHED: 'Voice conversion connected successfully',
    SESSION_STARTED: 'Voice conversation started',
    SESSION_ENDED: 'Voice conversation ended',
  },
};

// Helper functions
export const getStoredAgentId = () => {
  return localStorage.getItem(ELEVENLABS_CONFIG.STORAGE_KEYS.AGENT_ID) || '';
};

export const setStoredAgentId = (agentId) => {
  localStorage.setItem(ELEVENLABS_CONFIG.STORAGE_KEYS.AGENT_ID, agentId);
};

export const getStoredVolume = () => {
  const stored = localStorage.getItem(ELEVENLABS_CONFIG.STORAGE_KEYS.VOLUME);
  return stored ? parseFloat(stored) : ELEVENLABS_CONFIG.DEFAULT_VOLUME;
};

export const setStoredVolume = (volume) => {
  localStorage.setItem(ELEVENLABS_CONFIG.STORAGE_KEYS.VOLUME, volume.toString());
};

export default ELEVENLABS_CONFIG; 