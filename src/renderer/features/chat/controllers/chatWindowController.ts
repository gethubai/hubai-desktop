import { Controller } from 'mo/react/controller';
import { ChatBrain, ChatModel } from 'api-server/chat/domain/models/chat';
import {
  ChatMessageType,
  SendChatMessageModel,
} from 'api-server/chat/domain/models/chatMessage';
import {
  BrainCapability,
  BrainModel,
} from 'api-server/brain/domain/models/brain';
import { IChatWindowController } from './type';
import { IChatWindowService } from '../services/chatWindowService';
import { getTextMessageTypeForBrainCapability } from '../utils/messageUtils';

function blobToByteArray(blob: Blob): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const byteArray = new Uint8Array(arrayBuffer);
      resolve(byteArray);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(blob);
  });
}

export default class ChatWindowController
  extends Controller
  implements IChatWindowController
{
  constructor(
    private readonly chatWindowService: IChatWindowService,
    private readonly chat: ChatModel
  ) {
    super();
  }

  public initView(): void {}

  public onSendTextMessage = (message: string) => {
    const model = this.createMessageToSend('text');

    model.setText({ body: message });

    this.chatWindowService.sendMessage(model);
  };

  public onSendVoiceMessage = (audioBlob: Blob) => {
    blobToByteArray(audioBlob)
      .then((data: Uint8Array) => {
        const model = this.createMessageToSend('voice');

        model.setVoice({ data, mimeType: 'audio/wav' });

        this.chatWindowService.sendMessage(model);
      })
      .catch((err: any) => {
        console.error('@@@@ AUDIO ERROR:', err);
      });
  };

  public onCapabilityBrainChanged = (
    brain: BrainModel,
    capability: BrainCapability
  ) => {
    const { selectedBrains } = this.chatWindowService.getState();
    const chatMessageType = getTextMessageTypeForBrainCapability(capability);
    const chatBrain = {
      id: brain.id,
      handleMessageType: chatMessageType,
    } as ChatBrain;

    const newSelectedBrains = [...selectedBrains];
    const brainIndex = newSelectedBrains.findIndex(
      (b) => b.handleMessageType === chatMessageType
    );

    if (brainIndex === -1) {
      newSelectedBrains.push(chatBrain);
    } else {
      newSelectedBrains[brainIndex] = chatBrain;
    }

    this.chatWindowService.updateChatBrains(newSelectedBrains);
  };

  private createMessageToSend(
    messageType: ChatMessageType
  ): SendChatMessageModel {
    const sender = this.getSender();
    const brain = this.getBrain(messageType);

    const model = new SendChatMessageModel(
      this.chat.id,
      sender.name,
      sender.id,
      'user',
      brain.id
    );

    return model;
  }

  private getSender() {
    return { name: 'Matheus Diniz', id: '1' };
  }

  private getBrain(messageType: ChatMessageType): ChatBrain {
    const brainChat = this.chatWindowService
      .getState()
      .selectedBrains.find((brain) => brain.handleMessageType === messageType);

    if (!brainChat)
      throw new Error(`No brain found for message type ${messageType}`);

    return brainChat;
  }
}
