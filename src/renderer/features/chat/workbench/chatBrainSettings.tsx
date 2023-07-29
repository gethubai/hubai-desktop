import React, { useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import {
  BrainSettingScope,
  LocalBrainModel,
} from 'api-server/brain/domain/models/localBrain';
import { ChatUser } from 'api-server/chat/domain/models/chat';
import { ChatBrainSettingsForm } from './components/chatBrainSettingsForm';

type ChatBrainSettingsProps = {
  availableBrains: LocalBrainModel[];
  selectedBrains: ChatUser[];
  onSettingChanged: (brain: LocalBrainModel, newSettings: any) => void;
  getBrainChatSettings: (brain: LocalBrainModel) => any;
};

export function ChatBrainSettings({
  availableBrains,
  selectedBrains,
  getBrainChatSettings,
  onSettingChanged,
}: ChatBrainSettingsProps) {
  const uniqueSelectedBrains = useMemo(() => {
    return selectedBrains.filter((brain, index, array) => {
      return array.findIndex((b) => b.id === brain.id) === index;
    });
  }, [selectedBrains]);

  const onFormChange = useCallback(
    (brain: LocalBrainModel, newSettings: any) => {
      onSettingChanged?.(brain, newSettings);
    },
    [onSettingChanged]
  );

  const debounceFn = useMemo(
    () => debounce(onFormChange, 1000),
    [onFormChange]
  );

  return (
    <div>
      {uniqueSelectedBrains.length === 0 && <div>No brain selected</div>}

      {uniqueSelectedBrains.map((chatBrain) => {
        const brain = availableBrains.find((b) => b.id === chatBrain.id)!;
        const settingsMap = brain.settingsMap?.filter(
          (e) => e.scope === BrainSettingScope.CHAT_OVERRIDABLE
        );

        return (
          <div
            key={`brain-setting-${chatBrain.id}`}
            style={{ marginBottom: 15 }}
          >
            <ChatBrainSettingsForm
              brain={brain}
              currentSettings={getBrainChatSettings(brain)}
              settingsMap={settingsMap}
              onFormChange={(formData) => debounceFn(brain, formData)}
            />
          </div>
        );
      })}
    </div>
  );
}
