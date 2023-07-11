export const ServerPort = 4114;

const chatNamespace = '/chat';
export const ChatServerConfigs = Object.freeze({
  mainNamespace: chatNamespace,
  address: `http://localhost:${ServerPort}${chatNamespace}`,
});
