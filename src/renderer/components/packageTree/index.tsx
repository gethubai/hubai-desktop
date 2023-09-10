/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MouseEventHandler, useCallback } from 'react';
import './styles.scss';
import { classNames } from '@hubai/core';

export type PackageTreeItemProps = {
  displayName: string;
  shortDescription: string;
  icon?: string;
  publisherName?: string;
  onClick?: () => void;
  onRightClick?: MouseEventHandler<HTMLDivElement> | undefined;
  disabled: boolean;
};

export function PackageTreeItem({
  displayName,
  shortDescription,
  icon,
  publisherName,
  onClick,
  onRightClick,
  disabled,
}: PackageTreeItemProps) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [disabled, onClick]);

  return (
    <div
      className={classNames('package-tree__item', disabled && 'disabled')}
      onClick={handleClick}
      onContextMenu={onRightClick}
      aria-disabled={disabled}
    >
      <div className="icon-container">
        <img
          src={icon || 'https://via.placeholder.com/150'}
          alt="Package Icon"
        />
      </div>
      <div className="content-container">
        <div className="title ellipsis">
          <span>{displayName}</span>
        </div>
        <div className="content ellipsis">
          <span>{shortDescription}</span>
        </div>
        {!!publisherName && (
          <div className="author ellipsis">
            <span>{publisherName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export type PackageTreeProps = {
  data: PackageTreeItemProps[];
  onSelectItem?: (node: PackageTreeItemProps) => void;
};

export function PackageTree({ data, onSelectItem }: PackageTreeProps) {
  return (
    <div className="package-tree">
      {data?.map((item) => (
        <PackageTreeItem
          onClick={() => onSelectItem?.(item)}
          key={item.displayName}
          {...item}
        />
      ))}
    </div>
  );
}
