import React from 'react';
import { ChatMessageSendType } from './types';

type ChatMessageProps = {
  messageType: ChatMessageSendType;
  children: React.ReactNode;
};

function ChatMessage({ messageType, children }: ChatMessageProps) {
  return (
    <div role="list-item" className="monaco-list-row">
      <div className="monaco-tl-row">
        <div className="monaco-tl-contents">
          <div
            className={`interactive-item-container ${
              messageType === 'request'
                ? 'interactive-request'
                : 'interactive-response'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
