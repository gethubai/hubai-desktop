import React, { useCallback, useMemo } from 'react';
import { getEventPosition } from '@hubai/core';
import {
  IMenuItemProps,
  Menu,
  useContextViewEle,
} from '@hubai/core/esm/components';
import { LocalPackage } from 'api-server/packages/model/package';
import { PackageInstallationState } from 'api-server/packages/model/packageInstallationState';
import {
  PackageTree,
  PackageTreeItemProps,
} from 'renderer/components/packageTree';

export type LocalPackageTreeProps = {
  packages: LocalPackage[];
  onContextMenuClick: (item: IMenuItemProps, selected: LocalPackage) => void;
  onClick?: (selected: LocalPackage) => void;
  contextMenu: IMenuItemProps[];
};

export function LocalPackageTree({
  packages,
  onContextMenuClick,
  onClick,
  contextMenu,
}: LocalPackageTreeProps) {
  const contextView = useContextViewEle();

  const openContextMenu = useCallback(
    (e: React.MouseEvent, selected: LocalPackage) => {
      e.preventDefault();
      contextView?.show(getEventPosition(e), () => (
        <Menu
          role="menu"
          onClick={(_: any, item: IMenuItemProps) => {
            contextView?.hide();
            onContextMenuClick?.(item, selected);
          }}
          data={contextMenu}
        />
      ));
    },
    [contextView, onContextMenuClick, contextMenu]
  );

  const packageTree = useMemo(
    () =>
      packages.map((p) => {
        const isPendingReload =
          p.installationState === PackageInstallationState.pending_reload;

        return {
          displayName: `${p.displayName}${
            isPendingReload ? ' (Pending Reload)' : ''
          }`,
          shortDescription: p.description ?? '',
          publisherName: p.publisher,
          icon: p.iconUrl,
          onClick: () => onClick?.(p),
          onRightClick: (e) => openContextMenu(e, p),
          disabled: p.disabled || isPendingReload,
        } as PackageTreeItemProps;
      }),
    [packages, onClick, openContextMenu]
  );

  return <PackageTree data={packageTree} />;
}
