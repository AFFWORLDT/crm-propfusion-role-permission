# ElevenLabs Voice Conversion Setup Guide

This guide explains how to set up and use the ElevenLabs live voice conversion functionality in the CRM application.

## Overview

The voice conversion widget is a floating button located in the bottom-right corner of all pages in the application. It allows users to have real-time voice conversations with AI agents powered by ElevenLabs Conversational AI.

## Features

- **Live Voice Conversion**: Real-time speech-to-speech conversation
- **Volume Control**: Adjustable audio output volume
- **Connection Status**: Visual indicators for connection and speaking states
- **Message Log**: View recent conversation messages
- **Settings Management**: Easy configuration of Agent ID
- **Help System**: Built-in setup instructions

## Setup Instructions

### 1. Create ElevenLabs Account

1. Go to [ElevenLabs.io](https://elevenlabs.io)
2. Create a new account or sign in to your existing account
3. Navigate to the Conversational AI section

### 2. Create an Agent

1. In the Conversational AI dashboard, click "Create Agent"
2. Configure your agent with:
   - **Name**: Give your agent a descriptive name
   - **Voice**: Select a voice for your agent
   - **Personality**: Define the agent's behavior and responses
   - **Knowledge Base**: Add relevant information for your use case
   - **Tools**: Configure any additional tools your agent needs

### 3. Get Your Agent ID

1. Once your agent is created, go to the agent settings
2. Copy the Agent ID (it will look something like `abc123def456`)
3. This ID is required to connect to your specific agent

### 4. Configure in the Application

1. Click the voice conversion widget (microphone icon) in the bottom-right corner
2. Click "Settings" to open the configuration panel
3. Paste your Agent ID in the input field
4. Click "Save" to store your configuration

## Using the Voice Conversion Widget

### Widget States

- **Default State**: Gray microphone icon
- **Connected**: Green microphone icon
- **Speaking**: Red microphone icon with pulsing animation

### Controls

- **Start Conversation**: Begin a voice session with your agent
- **End Conversation**: Stop the current voice session
- **Volume Slider**: Adjust the audio output volume (0-100%)
- **Settings**: Configure your Agent ID
- **Help**: View setup instructions

### Features

#### Real-time Communication
- Speak naturally to your agent
- Receive voice responses in real-time
- View conversation messages in the message log

#### Volume Control
- Adjust volume using the slider
- Settings are saved automatically
- Volume persists between sessions

#### Message Log
- View recent conversation messages
- See both user input and agent responses
- Messages are displayed with timestamps

## Troubleshooting

### Common Issues

#### "Microphone permission denied"
- **Solution**: Allow microphone access in your browser settings
- Go to browser settings → Privacy and Security → Site Settings → Microphone
- Ensure the site has permission to access your microphone

#### "Failed to connect to ElevenLabs"
- **Solution**: Check your Agent ID and internet connection
- Verify your Agent ID is correct in settings
- Ensure you have a stable internet connection
- Check if your ElevenLabs account has sufficient credits

#### "Agent ID not set"
- **Solution**: Configure your Agent ID in settings
- Click the widget → Settings → Enter your Agent ID → Save

#### No audio output
- **Solution**: Check your system volume and browser audio settings
- Ensure your speakers/headphones are connected and working
- Check browser audio settings and unmute if necessary

### Browser Compatibility

The voice conversion widget works best with:
- **Chrome** (recommended)
- **Firefox**
- **Safari**
- **Edge**

### Security Notes

- Your Agent ID is stored locally in your browser
- No voice data is stored on the application servers
- All communication is encrypted via WebRTC/WebSocket
- Microphone access is only used during active conversations

## Advanced Configuration

### Environment Variables (Optional)

You can set default values using environment variables:

```bash
VITE_ELEVENLABS_DEFAULT_AGENT_ID=your_agent_id
VITE_ELEVENLABS_DEFAULT_VOLUME=0.7
```

### Custom Agent Configuration

For advanced users, you can modify the agent configuration in the ElevenLabs dashboard:

1. **Voice Selection**: Choose from hundreds of AI voices
2. **Personality Tuning**: Adjust response style and behavior
3. **Knowledge Base**: Add domain-specific information
4. **Tools Integration**: Connect external APIs and services

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your ElevenLabs account status
3. Ensure microphone permissions are granted
4. Contact support with specific error details

## Privacy and Data

- Voice conversations are processed by ElevenLabs
- No conversation data is stored by this application
- Review ElevenLabs privacy policy for data handling details
- You can delete your Agent ID from settings at any time 