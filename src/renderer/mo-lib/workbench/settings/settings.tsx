import React, { memo } from 'react';

import { prefixClaName } from '@hubai/core/esm/common/className';

const defaultClassName = prefixClaName('settings');

export function Settings() {
  return <div className={defaultClassName}>Settings</div>;
}

export default memo(Settings);
