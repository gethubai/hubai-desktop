import React from 'react';
import { Toolbar } from '@hubai/core/esm/components/toolbar';
import { classNames, prefixClaName } from '@hubai/core/esm/common/className';
import { Header, Content } from '@hubai/core/esm/workbench';
import { Search } from '@hubai/core/esm/components/search';
import type { SearchValues } from '@hubai/core/esm/components/search';
import { ISearchProps } from '@hubai/core/esm/model/workbench/search';
import { localize } from '@hubai/core/esm/i18n/localize';
import { type ISearchController } from 'mo/controllers';
import SearchTree from './searchTree';
import {
  deleteSearchValueClassName,
  emptyTextValueClassName,
  matchSearchValueClassName,
  replaceSearchValueClassName,
} from './base';

export interface ISearchPaneToolBar extends ISearchController, ISearchProps {}

function SearchPanel({
  value = '',
  replaceValue,
  searchAddons,
  replaceAddons,
  validationInfo,
  headerToolBar,
  result,
  toggleAddon,
  onResultClick,
  validateValue,
  setValidateInfo,
  onSearch,
  getSearchIndex,
  setSearchValue,
  setReplaceValue,
  onChange,
  toggleMode,
}: ISearchPaneToolBar) {
  const onClick = (e, item) => {};

  const handleSearchChange = (values: SearchValues = []) => {
    const [searchVal, replaceVal] = values;
    setSearchValue?.(searchVal);
    setReplaceValue?.(replaceVal);
    onChange?.(searchVal || '', replaceVal || '');
  };

  const handleToggleButton = (status: boolean) => {
    toggleMode?.(status);
  };

  const renderTitle = (node, _, isLeaf) => {
    const { name = '' } = node;
    if (!isLeaf) {
      return name;
    }
    const searchIndex = getSearchIndex ? getSearchIndex(name, value) : -1;
    const beforeStr = name.substr(0, searchIndex);
    const currentValue = name.substr(searchIndex, value.length);
    const afterStr = name.substr(searchIndex + value.length);
    const title =
      searchIndex > -1 ? (
        <span>
          {beforeStr}
          <span
            className={classNames(
              matchSearchValueClassName,
              replaceValue && deleteSearchValueClassName
            )}
          >
            {currentValue}
          </span>
          {replaceValue && (
            <span className={replaceSearchValueClassName}>{replaceValue}</span>
          )}
          {afterStr}
        </span>
      ) : (
        name
      );
    return title;
  };

  const handleSearch = (values: SearchValues = []) => {
    const [value, replaceVal] = values;
    validateValue?.(value || '', (err) => {
      if (err) {
        setValidateInfo?.({
          type: 'error',
          text: err.message,
        });
      } else {
        onSearch?.(value || '', replaceVal || '');
      }
    });
  };

  const handleTreeSelect = (item) => {
    if (item.isLeaf) {
      onResultClick?.(item, result);
    }
  };

  return (
    <div className={prefixClaName('search-pane', 'sidebar')}>
      <Header
        title={localize('sidebar.search.title', 'Search')}
        toolbar={<Toolbar data={headerToolBar || []} onClick={onClick} />}
      />
      <Content>
        <Search
          values={[value, replaceValue]}
          addons={[searchAddons, replaceAddons]}
          validationInfo={validationInfo}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          onAddonClick={toggleAddon}
          onButtonClick={handleToggleButton}
        />
        {value && result.length === 0 ? (
          <div className={emptyTextValueClassName}>
            未找到结果，请重新修改您的搜索条件
          </div>
        ) : (
          <SearchTree
            data={result}
            renderTitle={renderTitle}
            onSelect={handleTreeSelect}
          />
        )}
      </Content>
    </div>
  );
}

export default SearchPanel;
