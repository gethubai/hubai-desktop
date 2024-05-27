import { AttachmentType } from '../models/chatMessage';

export type SaveFileChatParams = {
  data: Buffer;
  mimeType: string;
};

export type SaveFileChatModel = {
  id: string;
  file: string;
  mimeType: string;
  attachmentType: AttachmentType;
};

export interface SaveFileChat {
  saveFile: (params: SaveFileChatParams) => Promise<SaveFileChatModel>;
}
