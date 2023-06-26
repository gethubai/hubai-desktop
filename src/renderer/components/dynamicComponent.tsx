import { useFederatedComponent } from 'renderer/common/dynamicModule';

export default function DynamicComponent({
  url,
  scope,
  module,
}: {
  url: string;
  scope: string;
  module: string;
}) {
  const { Component: DynComponent } = useFederatedComponent(url, scope, module);
  return DynComponent && <DynComponent />;
}
