import { SetVoiceMessageTranscription } from 'api-server/chat/domain/usecases/setVoiceMessageTranscription';
import { IChatMessageRepository } from 'data/chat/chatMessageRepository';

export default class LocalSetVoiceMessageTranscription
  implements SetVoiceMessageTranscription
{
  constructor(private readonly repository: IChatMessageRepository) {}

  async setTranscription(
    params: SetVoiceMessageTranscription.Params
  ): Promise<SetVoiceMessageTranscription.Model> {
    const { messageId, transcription } = params;
    const message = await this.repository.get(messageId);

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

    if (!transcription) {
      throw new Error(
        `Cannot set transcripton for message ${messageId}. Transcription is empty`
      );
    }

    message.text = { body: transcription };

    await this.repository.update(message);
    return message;
  }
}
