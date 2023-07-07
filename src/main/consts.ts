export const BrainIpcApiConfigs = Object.freeze({
  endpoints: Object.freeze({
    getAll: 'brains:all',
    install: 'brains:install',
    updateSettings: 'brains:settings:update',
  }),
});

export const UserSettingsIpcApiConfigs = Object.freeze({
  endpoints: Object.freeze({
    get: 'userSettings:single',
    setSetting: 'userSettings:single:set',
    getAll: 'userSettings:all',
    set: 'userSettings:all:set',
  }),
});

export const MediaAccessIpcApiConfigs = Object.freeze({
  endpoints: Object.freeze({
    getMicrophoneAccessStatus: 'mediaAccess:mic:status',
    askForMicrophoneAccess: 'mediaAccess:mic:ask',
  }),
});
