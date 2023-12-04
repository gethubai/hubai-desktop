import { AuxiliaryModel, IAuxiliaryData } from '@hubai/core';
import AuxiliaryBarService from 'mo/services/workbench/auxiliaryBarService';

export class ChatAuxiliaryBarModel extends AuxiliaryModel {
  tabs: Record<string, React.ReactNode[]> = {};
}

class ChatAuxiliaryBarService extends AuxiliaryBarService {
  constructor() {
    super();
    this.state = new ChatAuxiliaryBarModel();

    this.onTabClick(() => {
      const tab = this.getCurrentTab();
      const { tabs } = this.state as ChatAuxiliaryBarModel;

      if (tab && tabs[tab?.key]) {
        this.setChildren(
          <>
            {tabs[tab.key].map((c, i) => (
              <div key={`tab-content-${i}`}>{c}</div>
            ))}
          </>
        );
      }
    });
  }

  addTab(tab: IAuxiliaryData, tabContent: React.ReactNode) {
    const { tabs } = this.state as ChatAuxiliaryBarModel;

    if (!tabs[tab.key]) tabs[tab.key] = [];

    tabs[tab.key].push(tabContent);
    if (tabs[tab.key].length === 1) this.addAuxiliaryBar(tab);
  }
}

export default ChatAuxiliaryBarService;
