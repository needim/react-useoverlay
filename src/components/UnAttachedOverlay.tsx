import * as React from 'react';
import { IOverlay, useOverlay } from '../useOverlay';

export interface IUnAttachedOverlayProps extends Omit<IOverlay, 'placement'> {
  children: (isOpen: boolean) => JSX.Element;
}

// primitive for modal, drawer, notificiation like components
export const UnAttachedOverlay: React.FC<IUnAttachedOverlayProps> = ({
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
