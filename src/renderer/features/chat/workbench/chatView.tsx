import React, { useState, useRef, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageModel,
  SendButton,
  AttachmentButton,
} from '@chatscope/chat-ui-kit-react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  ChatMessageStatus,
  ChatMessageType,
} from 'api-server/chat/domain/models/chatMessage';
import { IChatWindowController } from '../controllers/type';
import { IChatWindowState } from '../models/chatWindow';
import BrainSelector from './components/brainSelector';

type MessageType = MessageModel & {
  id: string;
  status: ChatMessageStatus;
  messageType: ChatMessageType;
};

export interface IChatWindowProps
  extends IChatWindowController,
    IChatWindowState {}

function ChatWindow({
  messages: newMessages,
  availableBrains,
  selectedBrains,
  onSendTextMessage,
  onSendVoiceMessage,
  onCapabilityBrainChanged,
}: IChatWindowProps) {
  const inputRef = useRef();
  const [micStatus, setMicStatus] = useState('idle');
  const [msgInputValue, setMsgInputValue] = useState('');

  const recorderControls = useAudioRecorder();
  const addAudioElement = async (blob: Blob) => {
    onSendVoiceMessage?.(blob);
  };

  const handleSendMessage = (message: string) => {
    onSendTextMessage?.(message);

    setMsgInputValue('');
    inputRef.current?.focus();
  };

  const messages = newMessages.map((message) => {
    const content: string = message.text?.body ?? '';

    return {
      message: content,
      messageType: message.messageType,
      sentTime: message.sendDate,
      sender: message.sender,
      direction: message.senderType === 'user' ? 'outgoing' : 'incoming',
      id: message.id,
      status: message.status,
    } as MessageType;
  });

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

  return (
    <div style={{ position: 'relative', height: '500px' }}>
      <BrainSelector
        availableBrains={availableBrains}
        selectedBrains={selectedBrains}
        onCapabilityBrainChanged={onCapabilityBrainChanged}
      />
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((message) => (
              <Message key={message.id} model={message}>
                <Message.Header>{message.sender}</Message.Header>
                <Message.Footer>
                  <p>{message.sentTime} - </p>
                  <p>{message.status}</p>
                </Message.Footer>
                {message.messageType === 'voice' && (
                  <Message.CustomContent>
                    <AudioPlayer
                      autoPlay={false}
                      src={`msg://audio/${message.id}.wav`}
                      showSkipControls={false}
                      showFilledVolume={false}
                    />
                    <p>{message.message}</p>
                  </Message.CustomContent>
                )}
              </Message>
            ))}
          </MessageList>
          <div
            as={MessageInput}
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderTop: '1px dashed #d1dbe4',
            }}
          >
            <MessageInput
              ref={inputRef}
              onChange={(msg) => setMsgInputValue(msg)}
              value={msgInputValue}
              sendButton={false}
              attachButton={false}
              onSend={handleSendMessage}
              placeholder="Type message here"
              style={{
                flexGrow: 1,
                borderTop: 0,
                flexShrink: 'initial',
              }}
            />
            <SendButton
              onClick={() => handleSendMessage(msgInputValue)}
              disabled={msgInputValue.length === 0}
              style={{
                fontSize: '1.2em',
                marginLeft: 0,
                paddingLeft: '0.2em',
                paddingRight: '0.2em',
              }}
            />

            <AttachmentButton
              style={{
                fontSize: '1.2em',
                paddingLeft: '0.2em',
                paddingRight: '0.2em',
              }}
            />

            <AudioRecorder
              onRecordingComplete={(blob) => addAudioElement(blob)}
              recorderControls={recorderControls}
            />
          </div>
        </ChatContainer>
      </MainContainer>
      MicStatus: {micStatus}
    </div>
  );
}

export default ChatWindow;
