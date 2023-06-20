import { Controller } from 'mo/react/controller';
import { BrainViewModel } from '../models/brain';

export interface IBrainController extends Partial<Controller> {
  onBrainClick?: (item: BrainViewModel) => void;
}
