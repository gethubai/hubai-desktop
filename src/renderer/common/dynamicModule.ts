import React from 'react';

interface Container {
  init(shareScope: string): void;

  get(module: string): () => any;
}

declare const __webpackInitSharing__: (shareScope: string) => Promise<void>;
declare const __webpackShareScopes__: { default: string };

function loadModule(url: string) {
  try {
    return import(/* webpackIgnore:true */ url);
  } catch (e) {
    /* empty */
  }
  return null;
}

export function loadComponent(
  remoteUrl: string,
  scope: string,
  module: string
) {
  return async () => {
    // eslint-disable-next-line no-undef
    await __webpackInitSharing__('default');
    const container: Container = await loadModule(remoteUrl);
    // eslint-disable-next-line no-undef
    await container.init(__webpackShareScopes__.default);
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  };
}

const componentCache = new Map();
// Hook to cache downloaded component and which encapsulates the logic to load
// module dynamically
export const useFederatedComponent = (
  remoteUrl: string,
  scope: any,
  module: string
) => {
  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = React.useState<any>(null);

  React.useEffect(() => {
    if (Component) setComponent(null);
    // Only recalculate when key changes
  }, [Component, key]);

  React.useEffect(() => {
    if (!Component) {
      const Comp = React.lazy(loadComponent(remoteUrl, scope, module));
      componentCache.set(key, Comp);
      setComponent(Comp);
    }
    // key includes all dependencies (scope/module)
  }, [Component, key, module, remoteUrl, scope]);

  return { Component };
};
