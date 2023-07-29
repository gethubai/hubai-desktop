import { Controller } from 'api-server/main/protocols/controller';
import { SetVoiceMessageTranscriptionController } from 'api-server/presentation/chat/controllers';
import makeSetVoiceMessageTranscription from 'api-server/chat/factories/usecases/setVoiceMessageTranscriptionFactory';

export const makeSetVoiceMessageTranscriptionController =
  async (): Promise<Controller> => {
    return new SetVoiceMessageTranscriptionController(
      await makeSetVoiceMessageTranscription()
    );
  };
