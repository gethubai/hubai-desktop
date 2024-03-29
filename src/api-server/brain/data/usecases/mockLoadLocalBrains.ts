import {
  BrainCapability,
  LocalBrainModel,
  LocalBrainSettingMap,
} from 'api-server/brain/domain/models/localBrain';
import { LoadLocalBrains } from 'api-server/brain/domain/usecases/loadLocalBrains';

export default class MockLoadLocalBrains implements LoadLocalBrains {
  getBrains = async (): Promise<LocalBrainModel[]> => {
    const mockBrains: LocalBrainModel[] = [
      {
        id: 'fakeBrainId',
        name: 'fakeBrain',
        displayName: 'Test Brain',
        version: '1.0.0',
        main: 'main.js',
        capabilities: [
          BrainCapability.CONVERSATION,
          BrainCapability.VOICE_TRANSCRIPTION,
        ],
        description: 'This is a test brain',
      },
      {
        id: 'openai-id',
        name: 'openaiapi',
        displayName: 'OpenAI API',
        version: '1.0.0',
        main: 'main.js',
        description: 'Brain that uses OpenAI API',
        capabilities: [
          BrainCapability.CONVERSATION,
          BrainCapability.VOICE_TRANSCRIPTION,
        ],
        settingsMap: [
          new LocalBrainSettingMap('apiKey', 'OpenAI API Key', 'string', true),
          new LocalBrainSettingMap(
            'textModel',
            'Text Model',
            'string',
            true,
            'gpt-3.5-turbo',
            ['gpt-3.5-turbo', 'text-davinci-003', 'gpt-4'],
            '',
            'chat_overridable'
          ),
          new LocalBrainSettingMap(
            'audioTranscriberModel',
            'Audio Transcription Model',
            'string',
            true,
            'whisper-1',
            ['whisper-1']
          ),
          new LocalBrainSettingMap(
            'audioTranscriberDefaultLanguage',
            'Default Audio Transcriber Language',
            'string',
            true,
            'pt',
            ['pt', 'en', 'es']
          ),
        ],
      },
      {
        id: 'ChatGpt35',
        name: 'chatgpt35unnoficialapi',
        displayName: 'Chat GPT Unofficial API',
        description: 'Brain that uses an unofficial CHAT GPT-3 API',
        version: '1.0.0',
        main: 'main.js',
        capabilities: [BrainCapability.CONVERSATION],
        settingsMap: [
          new LocalBrainSettingMap(
            'accessToken',
            'Access Token',
            'string',
            true,
            '',
            [],
            'You can get an access token from logging in to https://chatgpt.com/ and going to https://chat.openai.com/api/auth/session'
          ),
          new LocalBrainSettingMap(
            'apiReverseProxyUrl',
            'Reverse Proxy URL',
            'string',
            true,
            'https://api.pawan.krd/backend-api/conversation'
          ),
        ],
      },
      /* {
        id: 'whisper',
        name: 'localwhisper',
        title: 'Whisper Speech Recognition',
        description: 'Brain that uses Whisper Speech Recognition',
        createdDate: new Date(),
        capabilities: [BrainCapability.VOICE_TRANSCRIPTION],
      },
      {
        id: 'fakeBrainId',
        name: 'testBrain',
        title: 'Test Brain',
        createdDate: new Date(),
        capabilities: [
          BrainCapability.CONVERSATION,
          BrainCapability.VOICE_TRANSCRIPTION,
        ],
        description: 'This is a test brain',
      }, */
    ];

    return mockBrains;
  };
}
