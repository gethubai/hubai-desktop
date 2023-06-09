import express, { Request, Response, Router } from 'express';

import {
  ILocalAudioTranscriberBrainService,
  type IBrainService,
} from './brainService';
import { ITextBrainService } from './brainService';
import OpenAiBrainSettings from './openai/settings';
import OpenAiBrainService from './openai/openaiBrain';

const openAiBrain = new OpenAiBrainService(
  new OpenAiBrainSettings('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')
);

const brains: IBrainService[] = [openAiBrain];

const router: Router = express.Router();

router.post('/:brain_id/text-prompt', async (req: Request, res: Response) => {
  const { brain_id: brainId } = req.params;
  const { prompts } = req.body;

  const brain = brains.find(
    (b) => b.getSettings().id === brainId
  ) as ITextBrainService;

  if (brain == null) {
    res
      .status(400)
      .send(`Brain ID: ${brainId} not found or does not support text-prompts`);
    return;
  }

  const result = await brain.sendTextPrompt(prompts);
  res.send({ brainId: brain.getSettings().id, result: result.result });
});

router.post(
  '/:brain_id/speech-to-text-local',
  async (req: Request, res: Response) => {
    const { brain_id: brainId } = req.params;
    const { prompt } = req.body;

    const brain = brains.find(
      (b) => b.getSettings().id === brainId
    ) as ILocalAudioTranscriberBrainService;

    if (brain == null) {
      res
        .status(400)
        .send(
          `Brain ID: ${brainId} not found or does not support speech-to-text`
        );
      return;
    }

    const result = await brain.transcribeAudio(prompt);
    res.send({ brainId: brain.getSettings().id, result: result.result });
  }
);

export default router;
