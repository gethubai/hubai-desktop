import { type IExtension } from 'mo/model';
import { ChatExtension } from './chat';

const extensions: IExtension[] = [new ChatExtension()];

export default extensions;
