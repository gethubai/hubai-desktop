/*
  This component was originally written by github user @samhirtarif for the npm package react-audio-player
  I decided not to use the NPM package because I want to be able to modify the code to fit our needs, and remove things that we don't need.
  Original repository: https://github.com/samhirtarif/react-audio-player/tree/master
*/

import { type ReactElement } from 'react';
import { Icon } from '@hubai/core/esm/components';

interface Props {
  isPlaying: boolean;
  onPlayClick: () => void;
  onPauseClick: () => void;
}

function AudioControls({
  isPlaying,
  onPlayClick,
  onPauseClick,
}: Props): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gridColumn: '2 / 2',
        gap: 15,
      }}
    >
      <Icon
        type={isPlaying ? 'pause' : 'play'}
        onClick={isPlaying ? onPauseClick : onPlayClick}
        style={{
          cursor: 'pointer',
          height: '20px',
          width: '20px',
        }}
      />
    </div>
  );
}

export default AudioControls;
