import chatServer from 'api-server/chat/chatTcpServer/server';
import { SocketIoTransport } from 'api-server/chat/chatTcpServer/socketIo/socketIoTransport';
import { ChatServerConfigs } from 'api-server/consts';
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

export const setupSocketIoServer = (httpServer: HttpServer): void => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:1212',
    },
  });

  const chatNamespace = io.of(ChatServerConfigs.mainNamespace);
  const transport = new SocketIoTransport(chatNamespace);
  chatServer.startServer(transport);
};
