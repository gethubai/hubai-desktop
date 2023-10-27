import { ChatList } from './chatList';
import ChatMessage from './chatMessage';
import {
  Attachments,
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
  MessageSenderAvatarImage,
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
  AvatarImage: MessageSenderAvatarImage,
  SenderName: MessageSenderUsername,
  Actions: MessageActions,
  Action: MessageAction,

  Content: MessageContent,
  Voice: VoiceMessage,
  Text: TextMessage,
  Attachments,
};
