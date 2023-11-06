import { CHAT_LANGUAGE_ID } from '@hubai/core/esm/monaco/chat';
import {
  languages,
  editor,
  Position,
  CancellationToken,
  Range,
} from 'monaco-editor';
import { IChatService } from 'renderer/features/chat/services/types';
import { container } from 'tsyringe';

let chatService: IChatService;
export const getChatService = (): IChatService => {
  if (!chatService)
    chatService = container.resolve<IChatService>('IChatService');

  return chatService;
};

export function registerChatCompletionProvider() {
  languages.register({ id: CHAT_LANGUAGE_ID });

  languages.setMonarchTokensProvider(CHAT_LANGUAGE_ID, {
    tokenizer: {
      root: [
        [/\[error.*/, 'custom-error'],
        [/\[notice.*/, 'custom-notice'],
        [/\[info.*/, 'custom-info'],
        [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
      ],
    },
  });

  languages.setLanguageConfiguration(CHAT_LANGUAGE_ID, {
    brackets: [
      ['{', '}'],
      ['[', ']'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
    ],
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
  });

  // Add command suggestions
  languages.registerCompletionItemProvider(CHAT_LANGUAGE_ID, {
    provideCompletionItems(
      model: editor.ITextModel,
      position: Position,
      context: languages.CompletionContext,
      token: CancellationToken
    ): languages.ProviderResult<languages.CompletionList> {
      // get editor content before the pointer
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const range = new Range(1, 1, position.lineNumber, position.column);
      const suggestions: languages.CompletionItem[] = [];

      const completionCommands = getChatService().getCompletionCommands();

      Object.keys(completionCommands).forEach((command) => {
        const desiredCommand = `/${command}`;

        if (!desiredCommand.startsWith(textUntilPosition)) {
          return;
        }

        completionCommands[command]
          .flatMap((m) => m.values)
          .forEach((value) => {
            if (!value) return;

            suggestions.push({
              label: `/${command} ${value.label}`,
              range,
              kind: languages.CompletionItemKind.Function,
              insertText: value.insertText,
              detail: value.shortDescription,
              documentation: value.description,
              insertTextRules:
                languages.CompletionItemInsertTextRule.InsertAsSnippet,
            });
          });
      });

      return { suggestions };
    },
  });
}
