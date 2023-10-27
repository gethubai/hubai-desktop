/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo, useState } from 'react';
import { Modal } from '@hubai/core/esm/components';
import { AudioPlayer } from '../audio/audioPlayer';
import { ChatMessageAttachment, ChatVoiceMessageContent } from './types';

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

type MediaAttachmentProps = {
  attachment: ChatMessageAttachment;
  onClick?: (attachment: ChatMessageAttachment) => void;
};
export function MediaAttachment({ attachment, onClick }: MediaAttachmentProps) {
  return (
    <figure className="gallery-item" onClick={() => onClick?.(attachment)}>
      <img
        src={attachment.fileSrc}
        alt={attachment.name}
        className="gallery-item__image"
      />
    </figure>
  );
}

type FileAttachmentProps = {
  attachment: ChatMessageAttachment;
  onClick?: (attachment: ChatMessageAttachment) => void;
};
export function FileAttachment({ attachment, onClick }: FileAttachmentProps) {
  return (
    <figure
      className="gallery-item value"
      onClick={() => onClick?.(attachment)}
    >
      <div className="gallery-item-container">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAxlBMVEW8wsa8wsaYp6istrmZnqG9w8eYp6iUpKVHcEyVpaa2vsGVpaaUpKWVpaaUpKW8wsa9w8e7wsaVpaaVpaabqaulsbOcqqyLmpqWpqeUpKWUpKWUpKW9w8e8wsa9w8e8wsa9w8e9w8e2u7+1u7+ZnqG8wsa8wsa9w8efrK6bqquVpaa7wcWVpaaPnp+1vcCQn6CWpaeVpaaaqaqWnJ+yu76UpKWVpaa9w8e8wsa7wcWstrmlsbOcqqyWpqeWpaa1vcC2vsGyu76Qa3sVAAAANnRSTlP++YX+BfmE/gD+/peV/NeVl/4v+P7+/gj+L/i+/b781/bXCAgBL/gv/oWV/tcI/gj+/YQF/pcfdpW2AAAB1UlEQVRo3u2ah26DMBCGndL0Svae3XvvQmbH+79UE0QqDNjG+Gik9E4nIqEkX/4PYxnFbDfjYhsJONtOVq+pAJfV46NcPv/b+Vx8Lw8v+oCT2h5z3WC7LL6XB3tHF3C6z3QK7C1NQC36W2UJHEedgQOcH+gCQEngAFWmV7AolSUOcOhqJ1Ba4gAXaQAKSxyApVCkssQDUiWQW0IByCxhKJJawkkgsYQFEFpCUiS2hJZAZMkI8MEB4i0ZKWoBKC0ZJZjyCWItGQE+w4AYS0aKWBtAZckogTu+clSWzADu7VRlyUzRoh7arZ7N1zViAq9HbMQ3NiDSqIriKlGCVd5Ifr/DJ5IlCLxpMeC89l8iHT6hrQg0S1vRalxHxrnf4RMpFGUB+MtRlM19sFE3GiVY01wUKFuz/uFUkflsSlMFKaK5iOYimovoRqNrQM9o9IxGdzIpIkWkaL0J6jgJ6kJAAQdQEAIsHIAlBHRwLkFHCBhMMBJMBkJAZf5mDvieV4SAEjxZpn6sHpSEgH4ZnJn1NQ4ueJKui5Y9Lkxm4Dz3xZsGiv7fJIFOui7y2vt4UbIroTsE4xo+yjZudIvl0Hok6bLF7/L7vWLrSaN010wLaFZuGuHv+wHELr0xAczAJQAAAABJRU5ErkJggg=="
          alt={attachment.name}
          className="gallery-item__image"
        />
        <p>
          {attachment.name} ({attachment.size})
        </p>
      </div>
    </figure>
  );
}

type AttachmentsProps = {
  data: ChatMessageAttachment[];
};

export function Attachments({ data }: AttachmentsProps) {
  const [activeAttachment, setActiveAttachment] = useState<
    ChatMessageAttachment | undefined
  >();

  const attachments = useMemo<
    Record<'media' | 'file', ChatMessageAttachment[]>
  >(() => {
    const result: Record<string, ChatMessageAttachment[]> = {};

    data?.forEach((attachment) => {
      let attachmentType = 'file';
      if (['image', 'video'].includes(attachment.attachmentType)) {
        attachmentType = 'media';
      }

      if (!result[attachmentType]) {
        result[attachmentType] = [];
      }

      result[attachmentType].push(attachment);
    });

    return result;
  }, [data]);

  return (
    <div className="attachments">
      <div className="gallery">
        {attachments.media?.map((attachment) => (
          <MediaAttachment
            key={attachment.id}
            attachment={attachment}
            onClick={setActiveAttachment}
          />
        ))}
      </div>

      <div className="gallery">
        {attachments.file?.map((attachment) => (
          <FileAttachment
            key={attachment.id}
            attachment={attachment}
            onClick={setActiveAttachment}
          />
        ))}
      </div>

      <Modal
        visible={!!activeAttachment}
        onCancel={() => setActiveAttachment(undefined)}
        footer={null}
      >
        <div className="attachment-modal-content">
          {activeAttachment?.attachmentType === 'image' && (
            <img src={activeAttachment?.fileSrc} alt={activeAttachment?.name} />
          )}

          {activeAttachment?.attachmentType === 'video' && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video width="320" height="500" controls>
              <source
                src={activeAttachment?.fileSrc}
                type={activeAttachment?.mimeType}
              />
            </video>
          )}

          {activeAttachment?.attachmentType === 'document' && (
            <embed
              src={activeAttachment?.fileSrc}
              width="500"
              height="500"
              type="application/pdf"
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
