import LocalSaveAudioChat from 'api-server/chat/data/usecases/localSaveAudio';
import { SaveAudioChat } from 'api-server/chat/domain/usecases/saveAudio';

const makeSaveAudioChat = async (): Promise<SaveAudioChat> => {
  return new LocalSaveAudioChat();
};

export default makeSaveAudioChat;
