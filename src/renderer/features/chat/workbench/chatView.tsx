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
import {
  DropDown,
  Icon,
  Menu,
  Pane,
  SplitPane,
  Chat,
  Message,
  useDragDropZone,
  DragDropZone,
  FileMosaic,
} from '@hubai/core/esm/components';
import { editor as monaco } from '@hubai/core/esm/monaco';
import { IColors } from '@hubai/core';
import Markdown from 'renderer/components/markdown';
import { DropDownRef } from '@hubai/core/esm/components/dropdown';
import { ChatInputApi } from '@hubai/core/esm/components/chat/chatInput';
import { ChatAction } from '@hubai/core/esm/components/chat/types';
import { IChatWindowController } from '../controllers/type';
import { IChatWindowState } from '../models/chatWindow';
import BrainSelector from './components/brainSelector';

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
  isGroupChat,
  plusButtonActions,
  files,
  removeAttachedFile,
  users,
  attachFile,
}: IChatWindowProps) {
  const [micStatus, setMicStatus] = useState('idle');
  const chatInputRef = useRef<ChatInputApi>();
  const { getDragProps, isDragging } = useDragDropZone({ onDrop: attachFile });

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

  const childRef = useRef<DropDownRef>(null);

  const handlePlusButtonClick = () => {
    childRef.current!.dispose();
  };

  const plusButtonMenu = (
    <Menu
      role="menu"
      onClick={handlePlusButtonClick}
      style={{ width: 200 }}
      data={plusButtonActions}
    />
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
        console.error('err on getting micAccessStatus', err);
      });
  }, []);

  const sendMessage = useCallback(() => {
    const value = chatInputRef.current?.getValue();
    if (!value || value?.trim().length === 0) return;

    onSendTextMessage?.(value);
    chatInputRef?.current?.setValue('');
  }, [chatInputRef, onSendTextMessage]);

  const onChatAction = useCallback(
    (action: ChatAction, _: monaco.ICodeEditor) => {
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

  const usersTyping = Object.values(users).filter((u) => u.isTyping);
  return (
    <div style={{ position: 'relative', height: '100%' }} {...getDragProps()}>
      <DragDropZone dragOver={isDragging} />
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
              {isGroupChat && (
                <BrainSelector
                  availableBrains={availableBrains}
                  selectedBrains={selectedBrains}
                  onCapabilityBrainChanged={onCapabilityBrainChanged!}
                />
              )}
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

                            {!!message.attachments?.length && (
                              <Message.Attachments
                                data={message.attachments!}
                              />
                            )}
                          </Message.Content>
                        </Message.Root>
                      ))}
                    </Chat.List>
                    <div className="typing-container">
                      {usersTyping.map((u) => (
                        <div className="typing" key={`typing-${u.id}`}>
                          <p>
                            <b>{u.name}</b> is typing
                          </p>
                          <div className="typewriter" />
                        </div>
                      ))}
                    </div>
                  </Pane>

                  <Pane minSize="30%" maxSize="60%">
                    {!!files?.length && (
                      <FileMosaic
                        files={files.map((f) => ({
                          id: f.id,
                          title: f.name,
                          image: f.previewUrl,
                          description: f.size,
                        }))}
                        onRemove={(f) => removeAttachedFile(f.id)}
                      />
                    )}

                    <Chat.InteractionContainer>
                      <Chat.Input
                        id={id}
                        onAction={onChatAction}
                        onApiRef={setApiRef}
                        monacoInputOptions={{ fixedOverflowWidgets: true }}
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

                        <Chat.Action className="plus-button">
                          <DropDown
                            ref={childRef}
                            trigger="click"
                            placement="right"
                            overlay={plusButtonMenu}
                          >
                            <Icon type="add" />
                          </DropDown>
                        </Chat.Action>
                      </Chat.Actions>
                    </Chat.InteractionContainer>
                  </Pane>
                </SplitPane>
              </div>
            </div>
          </Pane>

          <Pane minSize={100} maxSize="80%" style={{ overflowY: 'scroll' }}>
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
