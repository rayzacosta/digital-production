import React from 'react';
import moment from 'moment';

type TimerProps = {
  startedDate: string;
};

export const Timer = ({ startedDate }: TimerProps) => {
  return (
    <div>
      <p>{moment(startedDate).fromNow()}</p>
    </div>
  );
};
