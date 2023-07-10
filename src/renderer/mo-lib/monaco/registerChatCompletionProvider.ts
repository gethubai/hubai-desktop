import {
  languages,
  editor,
  Position,
  CancellationToken,
  Range,
} from 'monaco-editor';

export const CHAT_LANGUAGE_ID = 'ailang';

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
      // check if the '/' has been typed
      if (textUntilPosition.startsWith('/prompt')) {
        // TODO: Load prompts from chat service
        return {
          suggestions: [
            {
              label: '/prompt developer',
              range,
              kind: languages.CompletionItemKind.Function,
              insertText: 'You are a developer and blablabla',
              insertTextRules:
                languages.CompletionItemInsertTextRule.InsertAsSnippet,
            },
            {
              label: '/prompt documentation',
              kind: languages.CompletionItemKind.Snippet,
              range,
              insertText:
                'Youre a developer creating documentation. Now do blabla',
              insertTextRules:
                languages.CompletionItemInsertTextRule.InsertAsSnippet,
            },
          ],
        };
      }
      return { suggestions: [] };
    },
  });
}
