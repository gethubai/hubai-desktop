import React, { useEffect, useRef } from 'react';

type ChatListProps = {
  children: React.ReactNode;
  messagesCount: number;
};

export function ChatList({ children, messagesCount }: ChatListProps) {
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interactiveList = chatListRef.current;

    const handleScroll = () => {
      if (interactiveList) {
        const { scrollHeight } = interactiveList;
        interactiveList.scrollTop = scrollHeight;
      }
    };

    handleScroll();
  }, [messagesCount]);

  return (
    <div id="chat-list" className="chat-list" ref={chatListRef}>
      <div className="monaco-list">
        <div className="monaco-scrollable-element">
          <div className="monaco-list-rows">{children}</div>
        </div>
      </div>
    </div>
  );
}
