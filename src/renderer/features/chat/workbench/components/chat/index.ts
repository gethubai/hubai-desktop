import { ChatList } from './chatList';
import ChatMessage from './chatMessage';
import {
  MessageContent,
  TextMessage,
  VoiceMessage,
} from './chatMessageContent';

import './styles.scss';

import MessageHeader, {
  MessageAction,
  MessageActions,
  MessageSender,
  MessageSenderAvatarIcon,
  MessageSenderUsername,
} from './chatMessageHeader';
import ChatInteractionContainer, { ChatInput } from './chatInput';
import { ChatInputAction, ChatInputActions } from './chatInputActions';

export const Chat = {
  List: ChatList,
  InteractionContainer: ChatInteractionContainer,
  Input: ChatInput,
  Actions: ChatInputActions,
  Action: ChatInputAction,
};

export const Message = {
  Root: ChatMessage,
  Header: MessageHeader,
  Sender: MessageSender,
  AvatarIcon: MessageSenderAvatarIcon,
  SenderName: MessageSenderUsername,
  Actions: MessageActions,
  Action: MessageAction,

  Content: MessageContent,
  Voice: VoiceMessage,
  Text: TextMessage,
};
