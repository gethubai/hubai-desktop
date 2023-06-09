import express, { type Request, type Response } from 'express';

import { type IBrainService } from './brain/brainService';
import { ITextBrainService } from './brain/brainService';
import OpenAiBrainSettings from './brain/openai/settings';
import OpenAiBrainService from './brain/openai/openaiBrain';

const bodyParser = require('body-parser');

const port = 4114;

const openAiBrain = new OpenAiBrainService(
  new OpenAiBrainSettings('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')
);

const brains: IBrainService[] = [openAiBrain];

// Create the express application
const app = express();
app.use(bodyParser.json());

// Add some routes
app.get('/', (req, res) => {
  res.send('AllAi server is running!');
});

app.post(
  '/api/brain/:brain_id/text-prompt',
  async (req: Request, res: Response) => {
    const { brain_id: brainId } = req.params;
    const { prompts } = req.body;

    const brain = brains.find(
      (b) => b.getSettings().id === brainId
    ) as ITextBrainService;

    // Check if brain implements the ITextBrainService interface
    if (brain == null) {
      res
        .status(400)
        .send(
          `Brain ID: ${brainId} not found or does not support text-prompts`
        );
      return;
    }

    const result = await brain.sendTextPrompt(prompts);
    res.send({ brainId: brain.getSettings().id, result: result.result });
  }
);

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
