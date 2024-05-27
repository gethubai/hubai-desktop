import { AuxiliaryModel } from '@hubai/core';
import React from 'react';

export class ChatAuxiliaryBarModel extends AuxiliaryModel {
  tabs: Record<string, React.ReactNode[]> = {};
}
