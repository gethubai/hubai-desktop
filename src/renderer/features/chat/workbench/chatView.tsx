/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import './styles.scss';
import { AudioRecorder } from 'react-audio-voice-recorder';
import 'react-h5-audio-player/lib/styles.css';
import { Icon, Pane, SplitPane } from '@hubai/core/esm/components';
import { editor as monaco } from '@hubai/core/esm/monaco';
import { IColors } from '@hubai/core';
import Markdown from 'renderer/components/markdown';
import { IChatWindowController } from '../controllers/type';
import { IChatWindowState } from '../models/chatWindow';
import BrainSelector from './components/brainSelector';
import { Chat, Message } from './components/chat';
import { ChatAction } from './components/chat/types';
import { ChatInputApi } from './components/chat/chatInput';

export interface IChatWindowProps
  extends IChatWindowController,
    IChatWindowState {
  getCurrentThemeColors: () => IColors;
}

function ChatWindow({
  messages,
  availableBrains,
  selectedBrains,
  onSendTextMessage,
  onSendVoiceMessage,
  onCapabilityBrainChanged,
  getCurrentThemeColors,
  AuxiliaryBarTabs,
  AuxiliaryBar,
  auxiliaryBarView,
  id,
}: IChatWindowProps) {
  const [micStatus, setMicStatus] = useState('idle');
  const chatInputRef = useRef<ChatInputApi>();

  const [splitPanePos, setSplitPanePos] = useState<string[] | number[]>([
    '75%',
    'auto',
  ]);
  const [contentPanePos, setContentPanePos] = useState<string[] | number[]>([
    '80%',
    'auto',
  ]);

  const colors = useMemo(
    () => getCurrentThemeColors(),
    [getCurrentThemeColors]
  );
  const getContentSize = () => {
    if (!auxiliaryBarView.hidden) return contentPanePos;

    return [contentPanePos[0], 0];
  };

  useEffect(() => {
    window.electron.mediaAccess
      .getMicrophoneAccessStatus()
      .then((status) => {
        setMicStatus(status);

        if (status !== 'granted') {
          window.electron.mediaAccess
            .askForMicrophoneAccess()
            .then((requestAccessStatus) => {
              setMicStatus(`${status}, granted: ${requestAccessStatus}`);
            })
            .catch((err) => {
              console.error('err on askForMicrophoneAccess', err);
            });
        }
      })
      .catch((err) => {
        console.log('err on getting micAccessStatus', err);
      });
  }, []);

  const sendMessage = useCallback(() => {
    const value = chatInputRef.current?.getValue();
    if (!value || value?.trim().length === 0) return;

    onSendTextMessage?.(value);
    chatInputRef?.current?.setValue('');
  }, [chatInputRef, onSendTextMessage]);

  const onChatAction = useCallback(
    (action: ChatAction, editor: monaco.ICodeEditor) => {
      if (action === ChatAction.sendMessage) {
        sendMessage();
      }
    },
    [sendMessage]
  );

  const setApiRef = useCallback((api: ChatInputApi) => {
    chatInputRef.current = api;
  }, []);

  useEffect(() => {
    chatInputRef.current?.triggerResize();
  }, [auxiliaryBarView.hidden]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 'inherit',
        }}
      >
        <SplitPane
          split="vertical"
          sizes={getContentSize()}
          showSashes={!auxiliaryBarView.hidden}
          onChange={setContentPanePos}
        >
          <Pane minSize="60%" maxSize="100%">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'inherit',
                width: '100%',
              }}
            >
              <BrainSelector
                availableBrains={availableBrains}
                selectedBrains={selectedBrains}
                onCapabilityBrainChanged={onCapabilityBrainChanged!}
              />
              <div className="chat-container">
                <SplitPane
                  sizes={splitPanePos}
                  split="horizontal"
                  onChange={setSplitPanePos}
                >
                  <Pane minSize="40%" maxSize="75">
                    <Chat.List messagesCount={messages.length}>
                      {messages.map((message) => (
                        <Message.Root
                          key={message.id}
                          messageType={message.messageType}
                        >
                          <Message.Header>
                            <Message.Sender>
                              {!!message.avatarIcon && !message.avatarSrc && (
                                <Message.AvatarIcon
                                  iconName={message.avatarIcon}
                                />
                              )}
                              {!!message.avatarSrc && (
                                <Message.AvatarImage src={message.avatarSrc} />
                              )}
                              <Message.SenderName>
                                {message.senderDisplayName}
                              </Message.SenderName>
                            </Message.Sender>

                            {/* <Message.Actions>
                      <Message.Action
                        onClick={() => {
                          console.log('Not available');
                        }}
                      />
                      </Message.Actions> */}
                          </Message.Header>
                          <Message.Content>
                            {!!message.voiceContent && (
                              <Message.Voice
                                audioSrc={message.voiceContent.audioSrc}
                                barColor={colors['chat.messageAudioBarColor']}
                                barPlayedColor={
                                  colors['chat.messageAudioBarPlayedColor']
                                }
                              />
                            )}
                            {!!message.textContent && (
                              <Message.Text>
                                <Markdown>{message.textContent}</Markdown>
                              </Message.Text>
                            )}
                          </Message.Content>
                        </Message.Root>
                      ))}
                    </Chat.List>
                  </Pane>

                  <Pane minSize="25%" maxSize="60%">
                    <Chat.InteractionContainer>
                      <Chat.Input
                        id={id}
                        onAction={onChatAction}
                        onApiRef={setApiRef}
                      />
                      <Chat.Actions>
                        <Chat.Action
                          className="send-button"
                          onClick={sendMessage}
                        >
                          <Icon type="send" />
                        </Chat.Action>

                        <Chat.Action className="voice-button">
                          <AudioRecorder
                            onRecordingComplete={onSendVoiceMessage}
                            audioTrackConstraints={{
                              noiseSuppression: true,
                              echoCancellation: true,
                            }}
                            downloadFileExtension="wav"
                          />
                        </Chat.Action>
                      </Chat.Actions>
                    </Chat.InteractionContainer>
                  </Pane>
                </SplitPane>
              </div>
            </div>
          </Pane>

          <Pane minSize={100} maxSize="80%">
            <AuxiliaryBar />
          </Pane>
        </SplitPane>
        <AuxiliaryBarTabs />
      </div>
      MicStatus: {micStatus}
    </div>
  );
}

export default ChatWindow;
