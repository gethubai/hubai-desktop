/* eslint-disable react/function-component-definition */
import React from 'react';

import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { ChatBrain } from 'api-server/chat/domain/models/chat';
import { getTextMessageTypeForBrainCapability } from '../../utils/messageUtils';

type BrainSelectorProps = {
  availableBrains: LocalBrainModel[];
  selectedBrains: ChatBrain[];
  onCapabilityBrainChanged: (
    brain: LocalBrainModel,
    capability: BrainCapability
  ) => void;
};

const BrainSelector: React.FC<BrainSelectorProps> = ({
  availableBrains,
  selectedBrains,
  onCapabilityBrainChanged,
}) => {
  const handleBrainChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    capability: BrainCapability
  ) => {
    const brainId = e.target.value;
    const selectedBrain = availableBrains.find((b) => b.id === brainId);
    onCapabilityBrainChanged(selectedBrain, capability);
  };

  // group the brains by type
  const brainsByType: Record<string, LocalBrainModel[]> = {};

  Object.values(BrainCapability).forEach((capability) => {
    brainsByType[capability] = availableBrains.filter((brain) =>
      brain.capabilities.includes(capability as BrainCapability)
    );
  });

  const getCapabilityName = (capability: string) => {
    const capabilities = {
      [BrainCapability.CONVERSATION]: 'Conversation',
      [BrainCapability.IMAGE_RECOGNITION]: 'Image Recognition',
      [BrainCapability.VOICE_TRANSCRIPTION]: 'Voice Transcription',
    };

    return capabilities[capability];
  };

  const getSelectedBrainForCapability = (
    capability: BrainCapability
  ): ChatBrain | undefined =>
    selectedBrains.find(
      (brain) =>
        brain.handleMessageType ===
        getTextMessageTypeForBrainCapability(capability)
    );

  return (
    <div>
      {Object.keys(brainsByType).map((capability) => {
        return (
          <div key={capability}>
            <label htmlFor={`brain-selector-${capability}`}>
              {getCapabilityName(capability as BrainCapability)} AI:
            </label>
            <select
              id={`brain-selector-${capability}`}
              value={
                getSelectedBrainForCapability(capability as BrainCapability)
                  ?.id ?? ''
              }
              onChange={(e) =>
                handleBrainChange(e, capability as BrainCapability)
              }
            >
              <option value="">Select a brain</option>
              {brainsByType[capability].map((brain) => (
                <option
                  key={`option-${capability}-${brain.id}`}
                  value={brain.id}
                >
                  {brain.name}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default BrainSelector;
