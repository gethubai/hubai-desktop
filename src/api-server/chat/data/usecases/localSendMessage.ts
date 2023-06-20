import {
  ChatMessageStatus,
  VoiceMessage,
} from 'api-server/chat/domain/models/chatMessage';
import {
  SendChatMessage,
  SendMessage,
} from 'api-server/chat/domain/usecases/sendChatMessage';
import { ChatDatabase } from 'data/chat/db';
import generateUniqueId from 'renderer/common/uniqueIdGenerator';
import { getMessageAudioStoragePath } from 'utils/pathUtils';
import fs from 'fs';

export default class LocalSendChatMessage implements SendMessage {
  constructor(private readonly database: ChatDatabase) {}

  async send(params: SendChatMessage.Params): Promise<SendChatMessage.Model> {
    const {
      sender,
      senderId,
      text,
      image,
      voice,
      messageType,
      chatId,
      senderType,
      to,
    } = params;

    const id = generateUniqueId();

    let voiceContent: VoiceMessage | undefined;

    if (messageType === 'voice' && voice) {
      // Save the message content to the disk
      const voiceFilePath = getMessageAudioStoragePath(`${id}.wav`);
      fs.writeFileSync(voiceFilePath, voice.data);

      voiceContent = {
        file: voiceFilePath,
        mimeType: voice.mimeType,
      };
    }

    const message = await this.database.messages.insert({
      id,
      sender,
      senderId,
      senderType,
      text,
      image,
      voice: voiceContent,
      messageType,
      chat: chatId,
      sendDate: new Date().toISOString(),
      to,
      status: ChatMessageStatus.SENT,
    });

    return message._data as SendChatMessage.Model;
  }
}
