import { SetVoiceMessageTranscription } from 'api-server/chat/domain/usecases/setVoiceMessageTranscription';
import { ChatDatabase } from 'data/chat/db';

export default class LocalSetVoiceMessageTranscription
  implements SetVoiceMessageTranscription
{
  constructor(private readonly database: ChatDatabase) {}

  async setTranscription(
    params: SetVoiceMessageTranscription.Params
  ): Promise<SetVoiceMessageTranscription.Model> {
    const { messageId, transcription } = params;
    const message = await this.database.messages.findOne(messageId).exec();

    if (message?.messageType !== 'voice') {
      throw new Error(
        `Cannot set transcripton for messageType ${message?.messageType}. Only voice messages are supported`
      );
    }

    if (message.text?.body) {
      throw new Error(
        `Cannot set transcripton for message ${messageId}. Transcription already exists`
      );
    }

    const updated = await message.incrementalUpdate({
      $set: {
        text: { body: transcription },
      },
    });

    return updated._data as SetVoiceMessageTranscription.Model;
  }
}
