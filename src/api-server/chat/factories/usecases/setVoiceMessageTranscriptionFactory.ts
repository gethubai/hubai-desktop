import { SetVoiceMessageTranscription } from 'api-server/chat/domain/usecases/setVoiceMessageTranscription';
import LocalSetVoiceMessageTranscription from 'api-server/chat/data/usecases/localSetVoiceMessageTranscription';
import { makeChatMessageRepository } from 'data/chat/factory';

const makeSetVoiceMessageTranscription =
  async (): Promise<SetVoiceMessageTranscription> => {
    return new LocalSetVoiceMessageTranscription(
      await makeChatMessageRepository()
    );
  };

export default makeSetVoiceMessageTranscription;
