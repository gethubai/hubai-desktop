import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { AudioRecorder } from 'react-audio-voice-recorder';
import 'react-h5-audio-player/lib/styles.css';
import { MessageBox, MessageList } from 'react-chat-elements';
import {
  AttachmentButton,
  MessageInput,
  SendButton,
} from '@chatscope/chat-ui-kit-react';
import { IChatWindowController } from '../controllers/type';
import { IChatWindowState } from '../models/chatWindow';
import BrainSelector from './components/brainSelector';

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

  const addAudioElement = async (blob: Blob) => {
    /* const context = new AudioContext();
    const buffer = await blob.arrayBuffer();
    const audio = await context.decodeAudioData(buffer);

    context.close();

    console.log(audio.duration); */
    onSendVoiceMessage?.(blob);
  };

  const handleSendMessage = (message: string) => {
    onSendTextMessage?.(message);

    setMsgInputValue('');
    inputRef.current?.focus();
  };

  const messages = newMessages.map((message) => {
    const content: string = message.text?.body ?? '';
    const msg = {
      message: content,
      messageType: message.messageType,
      sentTime: message.sendDate,
      sender: message.sender,
      direction: message.senderType === 'user' ? 'right' : 'left',
      id: message.id,
      status: message.status,
    } as any;

    if (msg.messageType === 'voice') {
      msg.messageType = 'audio';
      msg.data = {
        audioURL: `msg://audio/${message.id}.wav`,
        audioType: message.voice?.mimeType,
      };
    }

    return msg;
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
      <div>
        <MessageList
          dataSource={[]}
          lockable={false}
          toBottomHeight="100%"
          isShowChild
          customProps={{ style: { flexDirection: 'column' } }}
        >
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              position={message.direction}
              audioProps={{ preload: 'metadata' }}
              title={message.sender}
              type={message.messageType}
              text={message.message}
              data={message.data}
              date={message.sentTime}
              notch={false}
              avatar="https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-120.jpg"
              replyButton
            />
          ))}
        </MessageList>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px dashed #d1dbe4',
            backgroundColor: '#ffff',
            color: '#000',
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
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            downloadFileExtension="wav"
          />
        </div>
      </div>
      MicStatus: {micStatus}
    </div>
  );
}

export default ChatWindow;
