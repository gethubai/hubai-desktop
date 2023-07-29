import { ChatMemberType, ChatModel, ChatUser } from './domain/models/chat';
import { ChatMessageType } from './domain/models/chatMessage';

export function getMembersForMessageType(
  chat: ChatModel,
  messageType: ChatMessageType,
  memberType: ChatMemberType
): ChatUser[] {
  return chat.members.filter((m) => {
    if (
      m.memberType === memberType &&
      !m.handleMessageTypes?.includes(messageType)
    ) {
      return false;
    }
    return true;
  });
}

export function getMembersIdsForMessageType(
  chat: ChatModel,
  messageType: ChatMessageType,
  memberType: ChatMemberType
): string[] {
  return getMembersForMessageType(chat, messageType, memberType).map(
    (m) => m.id
  );
}
