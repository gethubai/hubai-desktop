import { Controller } from '@allai/core';
import { LocalBrainViewModel } from '../models/brain';

export interface IBrainController extends Partial<Controller> {
  onBrainClick?: (item: LocalBrainViewModel) => void;
  onSaveSettings?: (brain: LocalBrainViewModel, brainSettings: any) => void;
}
