/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useCallback } from 'react';
import { Button, Input, Option, Select } from '@hubai/core/esm/components';
import { ExtensionManagementService } from '../services/extensionManagement';
import './styles.scss';

export type InstallLocalExtensionWindowProps = ExtensionManagementService & {};
export function InstallLocalExtensionWindow({
  installPackage,
}: InstallLocalExtensionWindowProps) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [installMode, setInstallMode] = useState<'file' | 'url'>('file');
  const [reinstallPending, setReinstallPending] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    if (reinstallPending) {
      window.electron.restart();
      return;
    }
    let pathOrUrl = '';
    if (installMode === 'file') {
      if (!file) {
        setResult('Please select a .hext file to install');
        return;
      }

      pathOrUrl = file.path;
    } else if (installMode === 'url') {
      if (!url || !url.startsWith('http')) {
        setResult('Please enter a valid URL to install');
        return;
      }

      pathOrUrl = url;
    }

    const installationResult = installPackage(pathOrUrl);

    if (installationResult.error) {
      setResult(installationResult.error.message);
    } else {
      setResult('Extension installed successfully. Restart the app to use it.');
      setReinstallPending(true);
    }
  }, [installMode, file, url, installPackage, reinstallPending]);

  return (
    <div className="install-extension-container">
      <h1>Install extension</h1>

      <label>
        Installation mode:
        <Select
          id="install-mode"
          className="install-mode-select"
          value={installMode}
          onSelect={(e, option) => setInstallMode(option?.value as any)}
        >
          <Option key="install-mode-option-file" value="file">
            Install using .hext file
          </Option>

          <Option key="install-mode-option-url" value="url">
            Install from URL
          </Option>
        </Select>
      </label>
      {installMode === 'file' && (
        <div className="form">
          <label>
            Choose a local .hext file to install:
            <Input
              id="file-input"
              type="file"
              accept=".hext"
              multiple={false}
              onChange={(e: any) => {
                if (!e.target.files) {
                  return;
                }
                setFile(e.target.files[0]);
              }}
            />
          </label>
        </div>
      )}

      {installMode === 'url' && (
        <div className="form">
          <label>
            Enter a URL a remote extension to install (development only):
            <Input
              id="url-input"
              type="text"
              placeholder="http://localhost:4000"
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </label>
        </div>
      )}

      <div className="actions-container">
        <Button onClick={onSubmit}>
          {reinstallPending ? 'Reload' : 'Install'}
        </Button>
      </div>

      <p>{result}</p>
    </div>
  );
}
