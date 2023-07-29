import { Router } from 'express';
import multer from 'multer';
import { adaptRoute } from '../adapters/expressAdapter';
import { makeGetChatsController } from '../factories/chat/controllers/getChatsControllerFactory';
import { makeQueryChatMessagesController } from '../factories/chat/controllers/queryChatMessagesControllerFactory';
import { makeGetChatController } from '../factories/chat/controllers/getChatControllerFactory';
import { makeSendMessageController } from '../factories/chat/controllers/sendMessageControllerFactory';
import { makeAddChatMemberController } from '../factories/chat/controllers/addChatMemberControllerFactory';
import { makeRemoveChatMemberController } from '../factories/chat/controllers/removeChatMemberControllerFactory';
import { makeCreateChatController } from '../factories/chat/controllers/createChatControllerFactory';
import { makeSendAudioController } from '../factories/chat/controllers/sendAudioControllerFactory';
import { makeSetVoiceMessageTranscriptionController } from '../factories/chat/controllers/setVoiceMessageTranscriptionControllerFactory';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default (router: Router): void => {
  async function makeAsync() {
    router.get('/chats', adaptRoute(await makeGetChatsController()));
    router.get(
      '/chats/:chatId/messages',
      adaptRoute(await makeQueryChatMessagesController())
    );
    router.post(
      '/chats/:chatId/messages',
      adaptRoute(await makeSendMessageController())
    );
    router.put(
      '/chats/:chatId/messages/:messageId/transcription',
      adaptRoute(await makeSetVoiceMessageTranscriptionController())
    );
    router.post(
      '/chats/:chatId/upload/audio',
      upload.single('file'),
      adaptRoute(await makeSendAudioController())
    );
    router.post(
      '/chats/:chatId/members',
      adaptRoute(await makeAddChatMemberController())
    );
    router.post('/chats', adaptRoute(await makeCreateChatController()));
    router.delete(
      '/chats/:chatId/members/:memberId',
      adaptRoute(await makeRemoveChatMemberController())
    );
    router.get('/chats/:chatId', adaptRoute(await makeGetChatController()));
  }

  makeAsync();
};
