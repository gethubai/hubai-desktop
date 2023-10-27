import LocalSaveChatFile from 'api-server/chat/data/usecases/localSaveChatFile';
import { SaveFileChat } from 'api-server/chat/domain/usecases/saveFile';

const makeSaveFileChat = async (): Promise<SaveFileChat> => {
  return new LocalSaveChatFile();
};

export default makeSaveFileChat;
