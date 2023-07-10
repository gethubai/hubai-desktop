import React from 'react';
import { AudioPlayer } from '../audio/audioPlayer';
import { ChatVoiceMessageContent } from './types';

type MessageContentProps = {
  children: React.ReactNode;
};

export function MessageContent({ children }: MessageContentProps) {
  return <div className="value">{children}</div>;
}

type VoiceMessageProps = ChatVoiceMessageContent & {
  barColor: string;
  barPlayedColor: string;
};

export function VoiceMessage({
  audioSrc,
  barColor,
  barPlayedColor,
}: VoiceMessageProps) {
  return (
    <div className="audio-value">
      <AudioPlayer
        src={audioSrc}
        minimal
        width={250}
        trackHeight={40}
        barWidth={3}
        gap={1}
        visualise
        barColor={barColor}
        barPlayedColor={barPlayedColor}
        skipDuration={2}
        showLoopOption
        showVolumeControl
        hideSeekBar
        hideSeekKnobWhenPlaying
      />
    </div>
  );
}

type TextMessageProps = {
  children: React.ReactNode;
};

export function TextMessage({ children }: TextMessageProps) {
  return (
    <div className="text-value">
      <p>{children}</p>
    </div>
  );
}
