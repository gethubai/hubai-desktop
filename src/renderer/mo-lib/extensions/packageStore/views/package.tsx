/* eslint-disable promise/catch-or-return */
import { useEffect, useState, useCallback, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
// import HCaptcha from '@hcaptcha/react-hcaptcha';
import { component, localize } from '@hubai/core';
import { Icon, Tooltip } from '@hubai/core/esm/components';
import Markdown from 'renderer/components/markdown';
import { PackageController } from '../controllers/packageController';
import { PackageState } from '../services/packageService';

const { Button } = component;

export type Props = PackageController & PackageState;

function PackageView({ item, actionButtons, error, onCaptchaToken }: Props) {
  const [content, setContent] = useState('Loading content...');
  const [onVerifyCallback, setOnVerifyCallback] = useState<() => void>();
  const captchaRef = useRef<HCaptcha>(null);

  const onCaptchaVerify = useCallback(
    (token: string) => {
      onCaptchaToken(token);
      onVerifyCallback?.();
    },
    [onVerifyCallback, onCaptchaToken]
  );

  const fetchContent = useCallback(async () => {
    const latestVersion = item.versions[0];

    const assetContentUrl = latestVersion.assets.find(
      (asset) => asset.assetType.toLowerCase() === 'content'
    )?.source;

    if (!assetContentUrl) {
      setContent('No content found');
      return;
    }

    const response = await fetch(assetContentUrl);
    const fetchedContent = await response.text();

    setContent(fetchedContent);
  }, [item]);

  const onActionWithCaptcha = useCallback(async (action: () => void) => {
    captchaRef.current?.execute();
    setOnVerifyCallback(() => action);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [item.id, fetchContent]);

  const latestVersion = item.versions[0];

  return (
    <div className="package-container">
      <HCaptcha
        sitekey={process.env.HCAPTCHA_SITE_KEY ?? ''}
        onVerify={onCaptchaVerify}
        ref={captchaRef}
        size="invisible"
      />
      <div className="package-header">
        <div className="package-icon">
          <img src={item.icon} alt="package icon" />
        </div>
        <div className="package-info">
          <div className="package-name">
            {item.displayName}
            <span className="package-version">v{latestVersion.version}</span>
          </div>
          <div className="package-metadata-container">
            <div className="package-metadata">{item.publisherName}</div>
            <div className="package-metadata">
              <Icon type="cloud-download" className="icon" />
              {item.downloadCount}
            </div>
          </div>
          <div className="package-description">{item.shortDescription}</div>

          <div className="actions-container">
            {actionButtons.map((actionButton) => (
              <Button
                key={`action-button-${actionButton.text}`}
                onClick={
                  actionButton.hasCaptcha
                    ? () => onActionWithCaptcha(actionButton.action)
                    : actionButton.action
                }
                disabled={actionButton.disabled}
              >
                {actionButton.text}
              </Button>
            ))}
          </div>

          {!!error && (
            <div className="error-container">
              <Icon type="error" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="package-content">
        <div className="package-details">
          <div className="content">
            <Markdown>{content}</Markdown>
          </div>

          <div className="package-sidebar">
            {Array.isArray(item.capabilities) &&
            item.capabilities.length > 0 ? (
              <div className="package-sidebar-section">
                <div className="package-sidebar-section-title">
                  Capabilities
                </div>
                <div className="categories-container">
                  {item.capabilities?.map((capability) => (
                    <Tooltip
                      overlay={capability.description}
                      key={`capability-${capability.name}`}
                    >
                      <span className="category-badge">
                        {capability.displayName}
                      </span>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ) : (
              <div className="package-sidebar-section">
                <div className="package-sidebar-section-title">Categories</div>
                <div className="categories-container">
                  {item.categories?.map((category) => (
                    <span
                      className="category-badge"
                      key={`category-badge-${category}`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!!item.resources && item.resources.length > 0 && (
              <div className="package-sidebar-section">
                <div className="package-sidebar-section-title">
                  Package Resources
                </div>
                {item?.resources?.map((resource) => (
                  <a
                    key={`resource-link-${resource.id}`}
                    className="resource-link"
                    href={resource.value}
                  >
                    {localize(`resource.${resource.id}`, resource.id)}
                  </a>
                ))}
              </div>
            )}

            <div className="package-sidebar-section">
              <div className="package-sidebar-section-title">Infos</div>
              <table className="infos-table">
                <tbody>
                  <tr>
                    <td>Published</td>
                    <td>
                      {item.versions[item.versions.length - 1].releaseDate}
                    </td>
                  </tr>
                  <tr>
                    <td>Last Update</td>
                    <td>{latestVersion.releaseDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageView;
