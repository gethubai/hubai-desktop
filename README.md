# HubAI Application

HubAI is a cross-platform desktop application that will give you a new way to interact with any AI. It's your personal gateway to an expansive world of AI functionalities, right from your computer. Experience the thrill of creating, customizing, and engaging with diverse AIs, and join a vibrant community of AI enthusiasts and innovators.

## Links
- [Website](https://hubai.app)
- [Documentation](https://hubai.app/docs/intro)

## Features
- Install, and chat with multiple AIs at the same time, easily switching between them in the chat window
- Has a built-in package store that allows you to install a wide range of extensions and ChatBots built by the community.
- Allows you to easily install and use chat prompts built by our community
- Supports Windows, macOS, and Linux
- 100% open source and free to use. No ADS. No tracking. No data collection.
- We respect your privacy. All your chat history is encrypted and saved locally on your computer we don't store any messages on our servers.
- Theme system that allows you to choose between Dark or Light mode (or any theme built by our community)
- Auto update to the latest version
- Build and publish custom extensions and AIs easily using our CLI

## Technologies
- Electron
- Javascript and Typescript
- React
- NodeJS
- MQTT.js (for chat)


## Plugin development
At Hubai we have two types of plugins: Extensions and Brains.

### Brains
Brains are IA with at least one of the following capabilities: 
1. **Conversation**: Can talk with the user in the chat window (like chat-gpt, bard, etc)
2. **Voice Transcription**: Can transcript voice to text
3. **Image Recognition**: Can recognize and describe images
4. **Image Generation**: Can generate images 


#### Resources
- [How to create your first brain](https://www.hubai.app/docs/brains/getting-started)
- [How to create a brain that uses the OpenAI API](https://www.hubai.app/docs/brains/tutorials/how-to-create-a-brain-with-openai)

### Extensions
Extensions allow you to extend HubAI by adding new functionalities like commands, prompts, themes, windows, etc.

#### Resources
- [How to create your first extension](https://www.hubai.app/docs/extensions/getting-started)

# How to run the project

## Requirements
- [NodeJS 20+](https://nodejs.org/en/download)

## Steps
1. Clone the repository
```bash
git clone https://github.com/gethubai/hubai-desktop
```

2. Install dependencies
```bash
npm install
```

3. Copy `.env.example` to `.env` in the root of the project and replace the appropriate values.

4. Run the project
```bash
npm start
```
