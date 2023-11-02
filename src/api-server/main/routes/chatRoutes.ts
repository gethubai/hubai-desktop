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
import { makeSetVoiceMessageTranscriptionController } from '../factories/chat/controllers/setVoiceMessageTranscriptionControllerFactory';
import { makeSendChatFileController } from '../factories/chat/controllers/sendChatFileControllerFactory';
import { makeRemoveChatController } from '../factories/chat/controllers/removeChatControllerFactory';
import { makeUpdateChatMemberStatusController } from '../factories/chat/controllers/updateChatMemberStatusControllerFactory';

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
      upload.any(),
      adaptRoute(await makeSendMessageController())
    );
    router.put(
      '/chats/:chatId/messages/:messageId/transcription',
      adaptRoute(await makeSetVoiceMessageTranscriptionController())
    );
    router.put(
      '/chats/:chatId/memberStatus',
      adaptRoute(await makeUpdateChatMemberStatusController())
    );
    router.post(
      '/chats/:chatId/upload/file',
      upload.single('file'),
      adaptRoute(await makeSendChatFileController())
    );
    router.post(
      '/chats/:chatId/members',
      adaptRoute(await makeAddChatMemberController())
    );
    router.post('/chats', adaptRoute(await makeCreateChatController()));
    router.delete(
      '/chats/:chatId',
      adaptRoute(await makeRemoveChatController())
    );
    router.delete(
      '/chats/:chatId/members/:memberId',
      adaptRoute(await makeRemoveChatMemberController())
    );
    router.get('/chats/:chatId', adaptRoute(await makeGetChatController()));
  }

  makeAsync();
};
