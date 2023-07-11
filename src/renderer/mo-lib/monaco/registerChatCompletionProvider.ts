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
      const suggestions = [];
      if (textUntilPosition.startsWith('/act')) {
        suggestions.push({
          label: '/act linuxTerminal',
          range,
          kind: languages.CompletionItemKind.Function,
          insertText:
            'I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}. My first command is pwd',
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        });

        suggestions.push({
          label: '/act translator',
          range,
          kind: languages.CompletionItemKind.Function,
          insertText:
            'I want you to act as an ${1:language} translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in ${1:language}. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level ${1:language} words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is "istanbulu cok seviyom burada olmak cok guzel"',
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        });

        suggestions.push({
          label: '/act travelGuide',
          range,
          kind: languages.CompletionItemKind.Function,
          insertText:
            'I want you to act as a travel guide. I will write you my location and you will suggest a place to visit near my location. In some cases, I will also give you the type of places I will visit. You will also suggest me places of similar type that are close to my first location. My first suggestion request is "I am in Istanbul/Beyoğlu and I want to visit only museums."',
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        });

        suggestions.push({
          label: '/act storyTeller',
          range,
          kind: languages.CompletionItemKind.Function,
          insertText:
            'I want you to act as a storyteller. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture peoples attention and imagination. Depending on the target audience, you may choose specific themes or topics for your storytelling session e.g., if its children then you can talk about animals; If it’s adults then history-based tales might engage them better etc. My first request is "I need an interesting story on perseverance."',
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        });
      }

      // check if the '/' has been typed
      if (textUntilPosition.startsWith('/prompt')) {
        suggestions.push({
          label: '/prompt developer',
          range,
          kind: languages.CompletionItemKind.Function,
          insertText:
            'You are a ${1:language} and you have ${2:years} years of experience. Now blabla $0',
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        });

        suggestions.push({
          label: '/prompt documentation',
          kind: languages.CompletionItemKind.Snippet,
          range,
          insertText: [
            'if (${1:condition}) {',
            '\t$0',
            '} else {',
            '\t',
            '}',
          ].join('\n'),
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        });
      }
      return { suggestions };
    },
  });
}
