import { Controller } from 'mo/react/controller';
import { ChatModel } from 'api-server/chat/domain/models/chat';
import { SendChatMessageModel } from 'api-server/chat/domain/models/chatMessage';
import { IChatWindowController } from './type';
import { IChatWindowService } from '../services/chatWindowService';

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

  public onSendMessage = (message: string) => {
    const sender = { name: 'Matheus Diniz', id: '1' };
    const brain = { id: 'brainIdTest' };

    const model = new SendChatMessageModel(
      this.chat.id,
      sender.name,
      sender.id,
      'user',
      brain.id
    );

    model.setText({ body: message });

    this.chatWindowService.sendMessage(model);
  };
}
