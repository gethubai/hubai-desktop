export const ServerPort = 4114;

const chatNamespace = '/chat';
export const ChatServerConfigs = Object.freeze({
  mainNamespace: chatNamespace,
  address: `http://localhost:${ServerPort}${chatNamespace}`,
  endpoints: Object.freeze({
    getChat: 'get',
    createChat: 'create',
    join: 'join',
    chatList: 'list',
    getMessages: 'messages',
    sendMessage: 'message:send',
    messageReceivedAck: 'message:receivedAck',
    transcribeVoiceMessage: 'message:transcribeVoice',
    updateChatBrains: 'brains:update',
  }),
  events: Object.freeze({
    chatCreated: 'events:created',
    messageTranscribed: 'events:message:transcribed',
    messageUpdated: 'events:message:updated',
    messageReceived: 'events:message:received',
    messageSent: 'events:message:sent',
  }),
});
