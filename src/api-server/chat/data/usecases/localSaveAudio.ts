import { SaveAudioChat } from 'api-server/chat/domain/usecases/saveAudio';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { getMessageAudioStoragePath } from 'utils/pathUtils';
import fs from 'fs';

export default class LocalSaveAudioChat implements SaveAudioChat {
  async saveFile(params: SaveAudioChat.Params): Promise<SaveAudioChat.Model> {
    const { mimeType, data } = params;
    const id = generateUniqueId();

    const fileName = `${id}.wav`;

    const voiceFilePath = getMessageAudioStoragePath(fileName);
    fs.writeFileSync(voiceFilePath, data);

    return Promise.resolve({
      file: `msg://audio/${fileName}`,
      mimeType,
    });
  }
}
