import { IBrainServer } from '../brainServer';
import { IBrainService } from '../brainService';
import TcpBrainServer from '../tcpBrainServer';
/* import BrainServer from '../workers/brainServer';
import OpenAiBrainService from './openaiBrain';
import OpenAiBrainSettings from './settings';

const openAiSettings = new OpenAiBrainSettings('abc');
const openAi = new OpenAiBrainService(openAiSettings);
*/

// eslint-disable-next-line import/no-absolute-path
const openAi: IBrainService = require('/Users/macbook/brains/openai-brain/build/src/main.js');
// using absolute path to test if it works
const brainServer: IBrainServer = new TcpBrainServer(openAi.default);
export default brainServer;
