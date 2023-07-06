import { container, injectable } from 'tsyringe';
import { Component } from '@hubai/core/esm/react/component';

import {
  ISearchProps,
  SearchEvent,
  SearchModel,
  ISearchService,
} from '@hubai/core';
import { ITreeNodeItemProps } from '@hubai/core/esm/components';
import { searchById } from '@hubai/core/esm/common/utils';
import { type IBuiltinService } from '../builtinService';

@injectable()
class SearchService extends Component<ISearchProps> implements ISearchService {
  protected state: ISearchProps;

  private builtinService: IBuiltinService;

  constructor() {
    super();
    this.state = container.resolve(SearchModel);
    this.builtinService = container.resolve('IBuiltinService');
  }

  public setValidateInfo(info: string | ISearchProps['validationInfo']) {
    this.setState({
      validationInfo:
        typeof info === 'string'
          ? {
              type: 'info',
              text: info,
            }
          : info,
    });
  }

  public setSearchValue(value?: string) {
    this.setState({
      value,
    });
  }

  public setReplaceValue(value?: string) {
    this.setState({
      replaceValue: value,
    });
  }

  public setResult(value?: ITreeNodeItemProps[]) {
    this.setState({
      result: value || [],
    });
  }

  public toggleMode(status: boolean) {
    this.setState({
      replaceMode: status,
    });
  }

  public toggleCaseSensitive() {
    const { isCaseSensitive } = this.state;
    const { SEARCH_CASE_SENSITIVE_COMMAND_ID } =
      this.builtinService.getConstants();
    if (SEARCH_CASE_SENSITIVE_COMMAND_ID) {
      this.setState({
        isCaseSensitive: !isCaseSensitive,
      });
      this.updateStatus(SEARCH_CASE_SENSITIVE_COMMAND_ID, !isCaseSensitive);
    }
  }

  public toggleWholeWord() {
    const { isWholeWords } = this.state;
    const { SEARCH_WHOLE_WORD_COMMAND_ID } = this.builtinService.getConstants();
    if (SEARCH_WHOLE_WORD_COMMAND_ID) {
      this.setState({
        isWholeWords: !isWholeWords,
      });
      this.updateStatus(SEARCH_WHOLE_WORD_COMMAND_ID, !isWholeWords);
    }
  }

  public toggleRegex() {
    const { isRegex } = this.state;
    const { SEARCH_REGULAR_EXPRESSION_COMMAND_ID } =
      this.builtinService.getConstants();
    if (SEARCH_REGULAR_EXPRESSION_COMMAND_ID) {
      this.setState({
        isRegex: !isRegex,
      });
      this.updateStatus(SEARCH_REGULAR_EXPRESSION_COMMAND_ID, !isRegex);
    }
  }

  public togglePreserveCase() {
    const { preserveCase } = this.state;
    const { SEARCH_PRESERVE_CASE_COMMAND_ID } =
      this.builtinService.getConstants();
    if (SEARCH_PRESERVE_CASE_COMMAND_ID) {
      this.setState({
        preserveCase: !preserveCase,
      });
      this.updateStatus(SEARCH_PRESERVE_CASE_COMMAND_ID, !preserveCase);
    }
  }

  public updateStatus(addonId: string, checked: boolean) {
    const { replaceAddons = [], searchAddons = [] } = this.state;
    const target =
      replaceAddons.find(searchById(addonId)) ||
      searchAddons.find(searchById(addonId));

    if (target) {
      target.checked = checked;
      this.setState({
        replaceAddons: replaceAddons.concat(),
        searchAddons: searchAddons.concat(),
      });
    }
  }

  public reset() {
    this.setState({
      headerToolBar: [],
      searchAddons: [],
      replaceAddons: [],
      result: [],
      value: '',
      replaceValue: '',
      replaceMode: false,
      isRegex: false,
      isCaseSensitive: false,
      isWholeWords: false,
      preserveCase: false,
      validationInfo: { type: 'info', text: '' },
    });
  }

  public onReplaceAll(callback: () => void): void {
    this.subscribe(SearchEvent.onReplaceAll, callback);
  }

  public onChange(
    callback: (value: string, replaceValue: string) => void
  ): void {
    this.subscribe(SearchEvent.onChange, callback);
  }

  public onSearch(
    callback: (
      value: string,
      replaceValue: string,
      config: {
        isRegex: boolean;
        isCaseSensitive: boolean;
        isWholeWords: boolean;
        preserveCase: boolean;
      }
    ) => void
  ): void {
    this.subscribe(SearchEvent.onSearch, callback);
  }

  public onResultClick(
    callback: (
      item: ITreeNodeItemProps,
      resultData: ITreeNodeItemProps[]
    ) => void
  ): void {
    this.subscribe(SearchEvent.onResultClick, callback);
  }
}

export default SearchService;
