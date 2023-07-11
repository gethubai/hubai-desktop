import React, { useMemo } from 'react';

import { editor as monaco } from '@hubai/core/esm/monaco';
import { MonacoEditor } from '@hubai/core/esm/components';
import { CHAT_LANGUAGE_ID } from 'mo/monaco/registerChatCompletionProvider';

type ChatInputEditorProps = {
  editorInstanceRef: (editor: monaco.ICodeEditor) => void;
  model: monaco.ITextModel;
};

function ChatInputEditor({ model, editorInstanceRef }: ChatInputEditorProps) {
  const options = useMemo<monaco.IStandaloneEditorConstructionOptions>(
    () => ({
      model,
      readOnly: false,
      automaticLayout: true,
      lineNumbers: 'off',
      wordWrap: 'on',
      minimap: {
        enabled: false,
      },
      language: CHAT_LANGUAGE_ID,
    }),
    [model]
  );

  return (
    <div className="interactive-input-editor">
      <MonacoEditor options={options} editorInstanceRef={editorInstanceRef} />
    </div>
  );
}

export default ChatInputEditor;
