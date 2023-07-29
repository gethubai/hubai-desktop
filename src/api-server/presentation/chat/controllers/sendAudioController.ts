import { SaveAudioChat } from 'api-server/chat/domain/usecases/saveAudio';
import { IRequest } from 'api-server/main/protocols/requestContext';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { ok } from '../../helpers';

export class SendAudioController implements Controller {
  constructor(private readonly saveAudioChat: SaveAudioChat) {}

  handle = async (
    request: SendAudioController.Request
  ): Promise<HttpResponse> => {
    // TODO: Validate fileSize?
    const result = await this.saveAudioChat.saveFile({
      data: request.file.buffer,
      mimeType: request.file.mimetype,
    });
    return ok(result);
  };
}

export namespace SendAudioController {
  export type Request = IRequest & {
    /* data: Uint8Array;
    mimeType: string; */
    file: { buffer: Buffer; mimetype: string };
  };
}
