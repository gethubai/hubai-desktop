/*
  This component was originally written by github user @samhirtarif for the npm package react-audio-player
  I decided not to use the NPM package because I want to be able to modify the code to fit our needs, and remove things that we don't need.
  Original repository: https://github.com/samhirtarif/react-audio-player/tree/master
*/

import { type ReactElement } from 'react';

interface Props {
  seconds?: number;
}

function Timer({ seconds }: Props): ReactElement {
  return (
    <div className="timer">
      {seconds !== undefined
        ? `${Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0')}:${String(Math.round(seconds % 60)).padStart(
            2,
            '0'
          )}`
        : '--:--'}
    </div>
  );
}

export default Timer;
