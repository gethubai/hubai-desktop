import { inject, injectable } from 'tsyringe';
import { connect } from '@hubai/core/esm/react';
import { SearchPanel } from 'mo/workbench/sidebar/search';
import { IActionBarItemProps } from '@hubai/core/esm/components/actionBar';
import { SearchEvent } from '@hubai/core/esm/model/workbench/search';
import {
  type IActivityBarService,
  type ISearchService,
  type ISidebarService,
  Controller,
} from '@hubai/core';
import { ISearchProps, ITreeNodeItemProps } from '@hubai/core/esm/components';
import { type IBuiltinService } from 'mo/services/builtinService';

export interface ISearchController extends Partial<Controller> {
  getSearchIndex?: (text: string, queryVal?: string) => number;
  setSearchValue?: (value?: string) => void;
  setReplaceValue?: (value?: string) => void;
  setValidateInfo?: (info: string | ISearchProps['validationInfo']) => void;
  toggleMode?: (status: boolean) => void;
  toggleAddon?: (addon?: IActionBarItemProps) => void;
  validateValue?: (
    value: string,
    callback: (err: void | Error) => void
  ) => void;

  onResultClick?: (
    item: ITreeNodeItemProps,
    resultData: ITreeNodeItemProps[]
  ) => void;
  onChange?: (value: string, replaceValue: string) => void;
  onSearch?: (value: string, replaceValue: string) => void;
}

@injectable()
class SearchController extends Controller implements ISearchController {
  constructor(
    @inject('ISidebarService') private sidebarService: ISidebarService,
    @inject('IActivityBarService')
    private activityBarService: IActivityBarService,
    @inject('ISearchService') private searchService: ISearchService,
    @inject('IBuiltinService') private builtinService: IBuiltinService
  ) {
    super();
  }

  public initView() {
    const {
      builtInSearchActivityItem,
      builtInHeaderToolbar,
      builtInSearchAddons,
      builtInReplaceAddons,
    } = this.builtinService.getModules();
    if (builtInSearchActivityItem) {
      const SearchPanelView = connect(this.searchService, SearchPanel, this);

      const searchSidePane = {
        id: builtInSearchActivityItem.id,
        title: 'SEARCH',
        render() {
          return <SearchPanelView />;
        },
      };

      this.searchService.setState({
        headerToolBar: builtInHeaderToolbar || [],
        searchAddons: builtInSearchAddons || [],
        replaceAddons: builtInReplaceAddons || [],
      });

      this.sidebarService.add(searchSidePane);
      this.activityBarService.add(builtInSearchActivityItem);
    }
  }

  public validateValue = (
    value: string,
    callback: (err: void | Error) => void
  ) => {
    const { isRegex } = this.searchService.getState();
    if (isRegex) {
      try {
        new RegExp(value);
        return callback();
      } catch (e) {
        if (e instanceof Error) {
          return callback(e);
        }
      }
    }
    return callback();
  };

  public getSearchIndex = (text: string, queryVal: string = '') => {
    let searchIndex: number = -1;
    const { isCaseSensitive, isWholeWords, isRegex } =
      this.searchService.getState();
    const onlyCaseSensitiveMatch = isCaseSensitive;
    const onlyWholeWordsMatch = isWholeWords;
    const useAllCondtionsMatch = isCaseSensitive && isWholeWords;
    const notUseConditionsMatch = !isCaseSensitive && !isWholeWords;

    try {
      if (isRegex) {
        if (onlyCaseSensitiveMatch) {
          searchIndex = text.search(new RegExp(queryVal));
        }
        if (onlyWholeWordsMatch) {
          searchIndex = text.search(new RegExp(`\\b${queryVal}\\b`, 'i'));
        }
        if (useAllCondtionsMatch) {
          searchIndex = text.search(new RegExp(`\\b${queryVal}\\b`));
        }
        if (notUseConditionsMatch) {
          searchIndex = text.toLowerCase().search(new RegExp(queryVal, 'i'));
        }
      } else {
        if (onlyCaseSensitiveMatch) {
          searchIndex = text.indexOf(queryVal);
        }
        // TODO：应使用字符串方法做搜索匹配，暂时使用正则匹配
        if (onlyWholeWordsMatch) {
          const reg = new RegExp(`\\b${queryVal?.toLowerCase()}\\b`);
          searchIndex = text.toLowerCase().search(reg);
        }
        if (useAllCondtionsMatch) {
          searchIndex = text.search(new RegExp(`\\b${queryVal}\\b`));
        }
        if (notUseConditionsMatch) {
          searchIndex = text.toLowerCase().indexOf(queryVal?.toLowerCase());
        }
      }
    } catch (e) {
      console.error(e);
    }
    return searchIndex;
  };

  public readonly setValidateInfo = (
    info: string | ISearchProps['validationInfo']
  ) => {
    this.searchService.setValidateInfo(info);
  };

  public readonly setSearchValue = (value?: string) => {
    this.searchService.setSearchValue(value);
  };

  public readonly setReplaceValue = (value?: string) => {
    this.searchService.setReplaceValue(value);
  };

  public toggleAddon = (addon?: IActionBarItemProps) => {
    const addonId = addon?.id;
    const {
      SEARCH_CASE_SENSITIVE_COMMAND_ID,
      SEARCH_WHOLE_WORD_COMMAND_ID,
      SEARCH_REGULAR_EXPRESSION_COMMAND_ID,
      SEARCH_PRESERVE_CASE_COMMAND_ID,
      SEARCH_REPLACE_ALL_COMMAND_ID,
    } = this.builtinService.getConstants();
    switch (addonId) {
      case SEARCH_CASE_SENSITIVE_COMMAND_ID: {
        this.searchService.toggleCaseSensitive();
        break;
      }
      case SEARCH_WHOLE_WORD_COMMAND_ID: {
        this.searchService.toggleWholeWord();
        break;
      }
      case SEARCH_REGULAR_EXPRESSION_COMMAND_ID: {
        this.searchService.toggleRegex();
        break;
      }
      case SEARCH_PRESERVE_CASE_COMMAND_ID: {
        this.searchService.togglePreserveCase();
        break;
      }
      case SEARCH_REPLACE_ALL_COMMAND_ID: {
        this.emit(SearchEvent.onReplaceAll);
        break;
      }
      default:
        console.log('no addon');
    }
  };

  public readonly toggleMode = (status: boolean) => {
    this.searchService.toggleMode(status);
  };

  public onChange = (value: string = '', replaceValue: string = '') => {
    this.emit(SearchEvent.onChange, value, replaceValue);
  };

  public onSearch = (value: string = '', replaceValue: string = '') => {
    const { isRegex, isCaseSensitive, isWholeWords, preserveCase } =
      this.searchService.getState();

    this.emit(SearchEvent.onSearch, value, replaceValue, {
      isRegex,
      isCaseSensitive,
      isWholeWords,
      preserveCase,
    });
  };

  public onResultClick = (
    item: ITreeNodeItemProps,
    resultData: ITreeNodeItemProps[]
  ) => {
    this.emit(SearchEvent.onResultClick, item, resultData);
  };
}

export default SearchController;
