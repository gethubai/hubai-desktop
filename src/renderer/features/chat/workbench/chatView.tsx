import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import { IChatWindowController } from '../controllers/type';
import { IChatWindowState } from '../models/chatWindow';

export interface IChatWindowProps
  extends IChatWindowController,
    IChatWindowState {}

function ChatWindow({
  messages: newMessages,
  onSendMessage,
}: IChatWindowProps) {
  const handleSendMessage = (message: string) => {
    onSendMessage?.(message);
  };

  const messages = newMessages.map((message) => ({
    message: message.text?.body,
    sentTime: message.sendDate,
    sender: message.sender,
    direction: message.senderType === 'user' ? 'outgoing' : 'incoming',
    id: message.id,
    status: message.status,
  }));

  return (
    <div style={{ position: 'relative', height: '500px' }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((message) => (
              <Message key={message.id} model={message}>
                <Message.Header>{message.sender}</Message.Header>
                <Message.Footer>
                  <p>{message.sentTime} - </p>
                  <p>{message.status}</p>
                </Message.Footer>
              </Message>
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={handleSendMessage}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatWindow;
