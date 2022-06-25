import * as React from 'react';
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useClick,
  useFocus,
  useHover,
  FloatingContext,
  FloatingFocusManager,
  FloatingPortal,
  FloatingOverlay,
  UseFloatingProps,
  FloatingNode,
} from '@floating-ui/react-dom-interactions';
import { AnimatePresence, motion, Variant } from 'framer-motion';

const WithPortal = ({
  enabled,
  id,
  children,
}: {
  enabled: boolean;
  id?: string;
  children: JSX.Element;
}) => {
  return enabled ? (
    <FloatingPortal id={id}>{children}</FloatingPortal>
  ) : (
    children
  );
};

const WithMotion = ({
  enabled,
  children,
}: {
  enabled: boolean;
  children?: React.ReactNode;
}) => {
  return enabled ? (
    <AnimatePresence>{children}</AnimatePresence>
  ) : (
    <>{children}</>
  );
};

const WithFocusManager = ({
  enabled,
  context,
  returnFocus,
  children,
}: {
  enabled: boolean;
  context: FloatingContext;
  returnFocus: boolean;
  children: JSX.Element;
}) => {
  return enabled ? (
    <FloatingFocusManager context={context} returnFocus={returnFocus}>
      {children}
    </FloatingFocusManager>
  ) : (
    children
  );
};

const WithFloatingOverlay = ({
  enabled,
  children,
  className,
}: {
  enabled: boolean;
  className?: string;
  children: JSX.Element;
}) => {
  return enabled ? (
    <FloatingOverlay lockScroll className={className}>
      {children}
    </FloatingOverlay>
  ) : (
    children
  );
};

export interface IOverlayProps extends Omit<IOverlay, 'use'> {
  children: (isOpen: boolean, open: () => void) => JSX.Element;
  useClick?: boolean;
  useDismiss?: boolean;
  useFocus?: boolean;
  useHover?: boolean;
}

export interface IOverlay {
  role?: 'tooltip' | 'dialog' | 'menu' | 'listbox' | 'grid' | 'tree';
  nodeId?: string;
  parentId?: string;
  portalId?: string;
  placement?: Placement;
  interactive?: boolean;
  animations?: { open: Variant; close: Variant };
  useMotion?: boolean;
  usePortal?: boolean;
  useBackdrop?: boolean;
  useFocusManager?: boolean;
  returnFocus?: boolean;
  offset?: number;
  shift?: number;
  delay?: { open: number; close: number };
  use?: {
    click?: boolean;
    dismiss?: boolean;
    focus?: boolean;
    hover?: boolean;
  };
  overlay: (close: () => void) => JSX.Element;
  className?: string;
  wrapperClassName?: string;
  backdropClassName?: string;
}

export interface IOverlayReturn {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerProps: Record<string, unknown>;
  overlay: JSX.Element;
}

export const useOverlay = ({
  nodeId,
  parentId,
  placement,
  interactive = true,
  useMotion = false,
  usePortal = false,
  portalId = 'overlay',
  useFocusManager = false,
  useBackdrop = false,
  returnFocus = false,
  animations = {
    open: {
      opacity: 1,
      transform: 'scale(1)',
      transition: { duration: 0.15, ease: [0.165, 0.84, 0.44, 1] },
    },
    close: {
      opacity: 0,
      transform: 'scale(0)',
      transition: { duration: 0.15, ease: [0.165, 0.84, 0.44, 1] },
    },
  },
  offset: offsetProp = 8,
  shift: shiftProp = 8,
  delay = { open: 0, close: 0 },
  role = 'dialog',
  overlay,
  className,
  wrapperClassName = 'overlay--wrapper',
  backdropClassName = 'overlay--backdrop',
  use = { click: false, dismiss: false, focus: false, hover: false },
}: IOverlay): IOverlayReturn => {
  const [open, setOpen] = React.useState(false);
  const isCustom = !placement;

  const useFloatingParams: Partial<UseFloatingProps> = {
    open,
    onOpenChange: setOpen,
    nodeId,
  };
  if (!isCustom) {
    useFloatingParams.placement = placement;
    useFloatingParams.middleware = [
      offset(offsetProp),
      flip(),
      shift({ padding: shiftProp }),
    ];
    useFloatingParams.whileElementsMounted = autoUpdate;
  }

  const { x, y, reference, floating, strategy, context } =
    useFloating(useFloatingParams);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useRole(context, { role: role }),
    useClick(context, { enabled: !!use.click && !!interactive }),
    useFocus(context, { enabled: !!use.focus && !!interactive }),
    useHover(context, { enabled: !!use.hover && !!interactive, delay }),
    useDismiss(context, { enabled: !!use.dismiss, bubbles: parentId === null }),
  ]);

  const motionProps = useMotion && {
    initial: 'close',
    exit: 'close',
    animate: open ? 'open' : 'close',
    variants: animations,
  };

  const floatingProps = getFloatingProps({
    ref: floating,
    className: className,
    style: !isCustom
      ? {
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
        }
      : {},
  });

  return {
    open,
    setOpen,
    triggerProps: getReferenceProps({ ref: reference }),
    overlay: (
      <FloatingNode id={nodeId || ''}>
        <WithPortal id={`portal-${portalId}`} enabled={!!usePortal}>
          <WithMotion enabled={!!useMotion}>
            {interactive && open && (
              <WithFloatingOverlay
                className={backdropClassName}
                enabled={!!useBackdrop}
              >
                <WithFocusManager
                  enabled={!!useFocusManager}
                  context={context}
                  returnFocus={!!returnFocus}
                >
                  <div className={`floating-wrapper ${wrapperClassName}`}>
                    <motion.div {...motionProps} {...floatingProps}>
                      {overlay(() => setOpen(false))}
                    </motion.div>
                  </div>
                </WithFocusManager>
              </WithFloatingOverlay>
            )}
          </WithMotion>
        </WithPortal>
      </FloatingNode>
    ),
  };
};
