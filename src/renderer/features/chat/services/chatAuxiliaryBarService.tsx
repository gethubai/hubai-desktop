import { IAuxiliaryData } from '@hubai/core';
import AuxiliaryBarService from 'mo/services/workbench/auxiliaryBarService';
import React from 'react';
import { ChatAuxiliaryBarModel } from '../models/chatAuxiliaryBarModel';

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
            {tabs[tab.key].map((c, i) => {
              const key = `tab-content-${i}`;
              return <div key={key}>{c}</div>;
            })}
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
