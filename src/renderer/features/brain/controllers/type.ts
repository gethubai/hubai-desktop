import { Controller } from 'mo/react/controller';
import { LocalBrainViewModel } from '../models/brain';

export interface IBrainController extends Partial<Controller> {
  onBrainClick?: (item: LocalBrainViewModel) => void;
}
