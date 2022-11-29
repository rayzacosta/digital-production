import React from 'react';
import { Badge } from 'react-bootstrap';
import cx from 'classnames';

type LotBadgeProps = {
  className?: string;
  children: any;
  color?: string;
};

export const LotBadge = ({ className, children, color }: LotBadgeProps) => {
  return (
    <Badge
      className={cx(
        'fs-2',
        { [`bg-${color}`]: color, 'bg-info': !color },
        className
      )}
    >
      {children}
    </Badge>
  );
};
