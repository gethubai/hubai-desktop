import React from 'react';
import { prefixClaName } from '@allai/core/esm/common/className';
import { IOutput } from '@allai/core/esm/model/workbench/panel';
import { MonacoEditor } from '@allai/core/esm/components/monaco';

const defaultClassName = prefixClaName('output');

function Output(props: IOutput) {
  const { id, data = '', onUpdateEditorIns } = props;

  return (
    <div className={defaultClassName}>
      <MonacoEditor
        key={id}
        options={{
          value: data,
          readOnly: true,
          lineDecorationsWidth: 0,
          lineNumbers: 'off',
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
        }}
        editorInstanceRef={(editorInstance) => {
          onUpdateEditorIns?.(editorInstance);
        }}
      />
    </div>
  );
}

export default Output;
