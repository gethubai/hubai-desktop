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
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { AudioRecorder } from 'react-audio-voice-recorder';
import 'react-h5-audio-player/lib/styles.css';
import { Icon, Pane, SplitPane } from '@hubai/core/esm/components';
import { editor as monaco } from '@hubai/core/esm/monaco';
import { IColors } from '@hubai/core';
import { IChatWindowController } from '../controllers/type';
import { IChatWindowState } from '../models/chatWindow';
import BrainSelector from './components/brainSelector';
import { Chat, Message } from './components/chat';
import { ChatAction, ChatMessageViewModel } from './components/chat/types';
import { ChatInputApi } from './components/chat/chatInput';

export interface IChatWindowProps
  extends IChatWindowController,
    IChatWindowState {
  getCurrentThemeColors: () => IColors;
}

function ChatWindow({
  messages: newMessages,
  availableBrains,
  selectedBrains,
  onSendTextMessage,
  onSendVoiceMessage,
  onCapabilityBrainChanged,
  getCurrentThemeColors,
  getChat,
}: IChatWindowProps) {
  const id = useMemo(() => getChat().id, [getChat]);
  const [micStatus, setMicStatus] = useState('idle');
  const chatInputRef = useRef<ChatInputApi>();

  const [splitPanePos, setSplitPanePos] = useState(['75%', 'auto']);

  const colors = useMemo(
    () => getCurrentThemeColors(),
    [getCurrentThemeColors]
  );

  const messages = useMemo(
    () =>
      newMessages.map((message) => {
        const isSelf = message.senderType === 'user';
        const msg = {
          id: message.id,
          textContent: message.text?.body,
          voiceContent: message.voice
            ? {
                audioSrc: `msg://audio/${message.id}.wav`,
                mimeType: message.voice.mimeType,
              }
            : undefined,
          messageContentType: message.messageType,
          sentAt: message.sendDate,
          senderDisplayName: message.sender,
          messageType: isSelf ? 'request' : 'response',
          status: message.status,
          avatarIcon: isSelf ? 'account' : 'octoface',
        } as ChatMessageViewModel;

        return msg;
      }) as ChatMessageViewModel[],
    [newMessages, newMessages.length]
  );

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

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <BrainSelector
        availableBrains={availableBrains}
        selectedBrains={selectedBrains}
        onCapabilityBrainChanged={onCapabilityBrainChanged}
      />
      <div className="chat-container">
        <SplitPane
          sizes={splitPanePos}
          showSashes
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
                      <Message.AvatarIcon iconName={message.avatarIcon} />
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
                      <Message.Text>{message.textContent}</Message.Text>
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
                <Chat.Action className="send-button" onClick={sendMessage}>
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
      MicStatus: {micStatus}
    </div>
  );
}

export default ChatWindow;
