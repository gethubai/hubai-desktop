import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import {
  getMessageAudioStoragePath,
  getMessageFilesStoragePath,
  getMessageMediaStoragePath,
} from 'utils/pathUtils';
import fs from 'fs';
import { SaveFileChat } from 'api-server/chat/domain/usecases/saveFile';
import { AttachmentType } from 'api-server/chat/domain/models/chatMessage';

export default class LocalSaveChatFile implements SaveFileChat {
  async saveFile(params: SaveFileChat.Params): Promise<SaveFileChat.Model> {
    const { mimeType, data } = params;
    const id = generateUniqueId();
    const extension = mimeType.split('/')[1];

    const fileName = `${id}.${extension}`;
    const { attachmentType, getPath, fileType } =
      this.getAttachmentType(mimeType);

    const filePath = getPath(fileName);
    fs.writeFileSync(filePath, data);

    return Promise.resolve({
      id,
      file: `msg://${fileType}/${fileName}`,
      mimeType,
      attachmentType,
    });
  }

  getAttachmentType(mimeType: string): {
    attachmentType: AttachmentType;
    getPath: (fileName: string) => string;
    fileType: string;
  } {
    if (mimeType.startsWith('image'))
      return {
        attachmentType: 'image',
        getPath: getMessageMediaStoragePath,
        fileType: 'media',
      };
    if (mimeType.startsWith('video'))
      return {
        attachmentType: 'video',
        getPath: getMessageMediaStoragePath,
        fileType: 'media',
      };
    if (mimeType.startsWith('audio'))
      return {
        attachmentType: 'audio',
        getPath: getMessageAudioStoragePath,
        fileType: 'audio',
      };
    if (mimeType.startsWith('application/pdf'))
      return {
        attachmentType: 'document',
        getPath: getMessageFilesStoragePath,
        fileType: 'file',
      };

    return {
      attachmentType: 'file',
      getPath: getMessageFilesStoragePath,
      fileType: 'file',
    };
  }
}
