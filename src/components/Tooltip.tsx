import React, { useState } from 'react';
import { Tooltip as BSTooltip, TooltipProps } from 'reactstrap';

export default function Tooltip(props: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { target, children } = props;

  const toggle = () => setIsOpen(!isOpen);

  return (
    <BSTooltip {...props} target={target} isOpen={isOpen} toggle={toggle}>
      {children}
    </BSTooltip>
  );
}
