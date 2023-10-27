import { IRequest } from 'api-server/main/protocols/requestContext';
import { SaveFileChat } from 'api-server/chat/domain/usecases/saveFile';
import { Controller } from '../../../main/protocols/controller';
import { HttpResponse } from '../../../main/protocols/http';
import { ok } from '../../helpers';

export class SendChatFileController implements Controller {
  constructor(private readonly saveChatFile: SaveFileChat) {}

  handle = async (
    request: SendChatFileController.Request
  ): Promise<HttpResponse> => {
    // TODO: Validate fileSize?
    const result = await this.saveChatFile.saveFile({
      data: request.file.buffer,
      mimeType: request.file.mimetype,
    });

    return ok(result);
  };
}

export namespace SendChatFileController {
  export type Request = IRequest & {
    /* data: Uint8Array;
    mimeType: string; */
    file: { buffer: Buffer; mimetype: string };
  };
}
