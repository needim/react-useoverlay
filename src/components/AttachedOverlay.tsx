import * as React from 'react';
import { IOverlay, useOverlay } from '../useOverlay';

export interface IAttachedOverlayProps extends IOverlay {
  children: (isOpen: boolean) => JSX.Element;
}

// primitive for tooltip, popover, dropdown like components
export const AttachedOverlay: React.FC<IAttachedOverlayProps> = ({
  children,
  ...rest
}) => {
  const { open, triggerProps, overlay } = useOverlay(rest);

  // we need to wrap string children in a span to make them interactive
  return (
    <>
      {typeof children === 'string' ? (
        <span {...triggerProps}>{children}</span>
      ) : (
        // if children is not a string, we can just clone it
        React.cloneElement(children(open), triggerProps)
      )}
      {/* this is the actual overlay */}
      {React.cloneElement(overlay)}
    </>
  );
};
