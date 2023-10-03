/* eslint-disable jsx-a11y/no-static-element-interactions */
import { MouseEventHandler, useCallback } from 'react';
import './styles.scss';
import { classNames } from '@hubai/core';

export type ChatTreeItemProps = {
  id: string;
  title: string;
  content: string;
  avatars?: string[];
  footerText?: string;
  onClick?: () => void;
  onRightClick?: MouseEventHandler<HTMLDivElement> | undefined;
  disabled?: boolean;
};

export function ChatTreeItem({
  id,
  title,
  content,
  avatars,
  footerText,
  onClick,
  onRightClick,
  disabled,
}: ChatTreeItemProps) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [disabled, onClick]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      key={id}
      className={classNames('chat-tree__item', disabled && 'disabled')}
      onClick={handleClick}
      onContextMenu={onRightClick}
      aria-disabled={disabled}
    >
      <div className="avatar-container">
        {avatars?.map((avatar, i) => (
          <img
            // eslint-disable-next-line react/no-array-index-key
            key={`avatar-${avatar}-${i}`}
            src={avatar || 'https://via.placeholder.com/150'}
            alt="Member Avatar"
          />
        ))}
      </div>
      <div className="content-container">
        <div className="title ellipsis">
          <span>{title}</span>
        </div>

        {!!content && (
          <div className="content ellipsis">
            <span>{content}</span>
          </div>
        )}
        {!!footerText && (
          <div className="text-footer ellipsis">
            <span>{footerText}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export type ChatTreeProps = {
  data: ChatTreeItemProps[];
  onSelectItem?: (node: ChatTreeItemProps) => void;
};

export function ChatTree({ data, onSelectItem }: ChatTreeProps) {
  return (
    <div className="chat-tree">
      {data?.map((item) => (
        <ChatTreeItem
          onClick={() => onSelectItem?.(item)}
          key={item.id}
          {...item}
        />
      ))}
    </div>
  );
}
