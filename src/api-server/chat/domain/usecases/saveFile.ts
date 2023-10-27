import { AttachmentType } from '../models/chatMessage';

export interface SaveFileChat {
  saveFile: (params: SaveFileChat.Params) => Promise<SaveFileChat.Model>;
}

export namespace SaveFileChat {
  export type Params = {
    data: Buffer;
    mimeType: string;
  };

  export type Model = {
    id: string;
    file: string;
    mimeType: string;
    attachmentType: AttachmentType;
  };
}
