import React, { useCallback } from 'react';
import { Input } from '@hubai/core/esm/components';
import { PackageTree, PackageTreeProps } from 'renderer/components/packageTree';
import { PackageFilterController } from '../controllers/packageFilterController';
import { PackageFilterState } from '../services/packageFilterService';

export type Props = PackageTreeProps &
  PackageFilterController &
  PackageFilterState & {};

export function FilterablePackageTree({
  search,
  onSearch,
  onSubmit,
  ...rest
}: Props) {
  const onSearchInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <>
      <Input
        value={search}
        className="package-search-input"
        placeholder="Search"
        onChange={onSearch as any}
        onKeyDown={onSearchInputKeyDown}
      />
      <PackageTree {...rest} />
    </>
  );
}
