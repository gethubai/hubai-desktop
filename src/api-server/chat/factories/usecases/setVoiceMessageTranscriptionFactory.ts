import { SetVoiceMessageTranscription } from 'api-server/chat/domain/usecases/setVoiceMessageTranscription';
import LocalSetVoiceMessageTranscription from 'api-server/chat/data/usecases/localSetVoiceMessageTranscription';
import makeChatDatabase from '../databaseFactory';

const makeSetVoiceMessageTranscription =
  async (): Promise<SetVoiceMessageTranscription> => {
    return new LocalSetVoiceMessageTranscription(await makeChatDatabase());
  };

export default makeSetVoiceMessageTranscription;
