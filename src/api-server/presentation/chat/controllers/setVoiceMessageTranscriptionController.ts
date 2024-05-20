import { SetVoiceMessageTranscription } from 'api-server/chat/domain/usecases/setVoiceMessageTranscription';
import chatServer from 'api-server/chat/chatTcpServer/server';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { badRequest, ok } from '../../helpers';
import { IRequest } from '../../../main/protocols/requestContext';

export type SetVoiceMessageTranscriptionControllerRequest = IRequest & {
  messageId: string;
  transcription: string;
};

export class SetVoiceMessageTranscriptionController implements Controller {
  constructor(
    private readonly setMessageTranscription: SetVoiceMessageTranscription
  ) {}

  handle = async (
    request: SetVoiceMessageTranscriptionControllerRequest
  ): Promise<HttpResponse> => {
    if (!request.transcription || !request.messageId) {
      return badRequest(
        new Error('Missing required fields: transcription, messageId')
      );
    }

    // TODO: Check if the sender is on the chat)
    const result = await this.setMessageTranscription.setTranscription({
      messageId: request.messageId,
      transcription: request.transcription,
    });

    chatServer.notifyMessageUpdated(result, { ...result, text: undefined });

    return ok({ id: result.id });
  };
}
