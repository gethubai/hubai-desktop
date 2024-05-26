/* eslint-disable react/function-component-definition */
import React from 'react';

import {
  BrainCapability,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { Option, Select } from '@hubai/core/esm/components';
import { ChatUser } from 'api-server/chat/domain/models/chat';
import { getTextMessageTypeForBrainCapability } from '../../utils/messageUtils';

type BrainSelectorProps = {
  availableBrains: LocalBrainModel[];
  selectedBrains: ChatUser[];
  onCapabilityBrainChanged: (
    brain: LocalBrainModel,
    capability: BrainCapability
  ) => void;
  /* If true, it won't show the selector for capabilities that don't have any available brains */
  hideEmpty?: boolean;
};

const BrainSelector: React.FC<BrainSelectorProps> = ({
  availableBrains,
  selectedBrains,
  onCapabilityBrainChanged,
  hideEmpty,
}) => {
  const handleBrainChange = (brainId: string, capability: BrainCapability) => {
    const selectedBrain = availableBrains.find((b) => b.id === brainId);
    onCapabilityBrainChanged(selectedBrain as LocalBrainModel, capability);
  };

  // group the brains by type
  const brainsByType: Record<string, LocalBrainModel[]> = {};

  Object.values(BrainCapability).forEach((capability) => {
    brainsByType[capability] = availableBrains.filter((brain) =>
      brain.capabilities.includes(capability as BrainCapability)
    );
  });

  const getCapabilityViewModel = (
    capability: string
  ): { name: string; icon: string } => {
    const capabilities: any = {
      [BrainCapability.CONVERSATION]: { name: 'Conversation', icon: 'comment' },
      [BrainCapability.IMAGE_RECOGNITION]: {
        name: 'Image Recognition',
        icon: 'device-camera',
      },
      [BrainCapability.VOICE_TRANSCRIPTION]: {
        name: 'Voice Transcription',
        icon: 'record',
      },
      [BrainCapability.IMAGE_GENERATION]: {
        name: 'Image Generation',
        icon: 'device-camera',
      },
    };

    return capabilities[capability];
  };

  const getSelectedBrainForCapability = (
    capability: BrainCapability
  ): ChatUser | undefined =>
    selectedBrains.find((brain) =>
      brain.handleMessageTypes?.includes(
        getTextMessageTypeForBrainCapability(capability)
      )
    );

  return (
    <div className="brain-selector">
      {Object.keys(brainsByType).map((capability) => {
        const selectedBrain = getSelectedBrainForCapability(
          capability as BrainCapability
        );

        const capabilityModel = getCapabilityViewModel(
          capability as BrainCapability
        );

        if (hideEmpty && brainsByType[capability].length === 0) {
          return null;
        }

        return (
          <div key={capability} className="brain-capability-selector">
            <label htmlFor={`brain-selector-${capability}`}>
              {capabilityModel.name}
            </label>
            <Select
              value={selectedBrain?.id ?? ''}
              onSelect={(e, option) =>
                handleBrainChange(
                  option?.value ?? '',
                  capability as BrainCapability
                )
              }
              placeholder={`${capabilityModel.name} Brain`}
            >
              {brainsByType[capability].map((brain) => (
                <Option
                  key={`option-${capability}-${brain.id}`}
                  value={brain.id}
                  name={brain.displayName}
                  description={`Use ${brain.displayName} for ${capabilityModel.name}`}
                >
                  {brain.displayName}
                </Option>
              ))}
            </Select>
          </div>
        );
      })}
    </div>
  );
};

export default BrainSelector;
