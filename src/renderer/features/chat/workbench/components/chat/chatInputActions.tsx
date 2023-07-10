/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

type ChatActionsProps = {
  children: React.ReactNode;
};

export function ChatInputActions({ children }: ChatActionsProps) {
  return (
    <div className="monaco-toolbar interactive-execute-toolbar">
      <div className="monaco-action-bar">
        <ul className="actions-container">{children}</ul>
      </div>
    </div>
  );
}

type ChatActionProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export function ChatInputAction({
  onClick,
  children,
  className,
}: ChatActionProps) {
  return (
    <li className={`action-item ${className ?? ''}`} onClick={onClick}>
      {children}
    </li>
  );
}
