import { Icon } from '@hubai/core/esm/components';
import React from 'react';

type MessageHeaderProps = {
  children: React.ReactNode;
};

type MessageSenderProps = {
  children: React.ReactNode;
};

export function MessageSender({ children }: MessageSenderProps) {
  return <div className="user">{children}</div>;
}

type MessageSenderAvatarIconProps = {
  iconName: string;
};
export function MessageSenderAvatarIcon({
  iconName,
}: MessageSenderAvatarIconProps) {
  return (
    <div className="avatar">
      <Icon type={iconName} className="icon" />
    </div>
  );
}

type MessageSenderAvatarImageProps = {
  src: string;
};
export function MessageSenderAvatarImage({
  src,
}: MessageSenderAvatarImageProps) {
  return (
    <div className="avatar">
      <img className="avatar-image" src={src} alt="Sender avatar" />
    </div>
  );
}

type MessageSenderUsernameProps = {
  children: React.ReactNode;
};

export function MessageSenderUsername({
  children,
}: MessageSenderUsernameProps) {
  return <h3 className="username">{children}</h3>;
}

export function MessageActions({ children }: MessageHeaderProps) {
  return (
    <div className="monaco-toolbar">
      <div className="monaco-action-bar">
        <ul className="actions-container">{children}</ul>
      </div>
    </div>
  );
}

type MessageActionProps = {
  onClick: () => void;
};

export function MessageAction({ onClick }: MessageActionProps) {
  // TODO: Refactor this to allow customization
  return (
    <li className="action-item">
      <button
        className="action-label action-button"
        onClick={onClick}
        type="button"
      >
        <Icon type="close" />
      </button>
    </li>
  );
}

export function MessageHeader({ children }: MessageHeaderProps) {
  return <div className="header">{children}</div>;
}

export default MessageHeader;
