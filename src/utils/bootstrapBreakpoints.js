import { useEffect, useState } from 'react';

export const BS_SIZE_XS = 0;
export const BS_SIZE_SM = 576;
export const BS_SIZE_MD = 768;
export const BS_SIZE_LG = 992;
export const BS_SIZE_XL = 1200;
export const BS_SIZE_XXL = 1400;

// Ascending sizes
export const BS_SIZES = [BS_SIZE_XS, BS_SIZE_SM, BS_SIZE_MD, BS_SIZE_LG, BS_SIZE_XL, BS_SIZE_XXL];

export const BS_NAMES = {
  [BS_SIZE_XS]: 'xs',
  [BS_SIZE_SM]: 'sm',
  [BS_SIZE_MD]: 'md',
  [BS_SIZE_LG]: 'lg',
  [BS_SIZE_XL]: 'xl',
  [BS_SIZE_XXL]: 'xxl',
};

/**
 * This event dispatcher is meant to be a singleton.
 * It can be subscribed from different places to receive just one event per breakpoint change.
 *
 * In this project, it's instantiated to `__breakpointListener` and used by the hook useBootstrapBreakpoint()
 */
class BootstrapBreakpointEvent extends EventTarget {
  constructor(sizes = BS_SIZES) {
    super();

    this.__currentBreakpointIndex = 0;
    this.__sizes = sizes;

    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-console
      console.error('Unable to initialize bs breakpoint check');
      return;
    }

    sizes.forEach((size, i) => {
      if (size === 0) return; // useless to watch for changes around 0px

      const wmm = window.matchMedia(`(min-width: ${size}px)`);

      if (wmm.matches) {
        this.__currentBreakpointIndex = i;
      }
      wmm.addEventListener('change', this.onMediaQueryEvent(i));
    });
  }

  get current() {
    return this.__sizes[this.__currentBreakpointIndex];
  }

  onMediaQueryEvent(index) {
    return (e) => {
      this.__currentBreakpointIndex = e.matches ? index : index - 1;
      this.dispatchEvent(new CustomEvent('breakpoint', { detail: this.current }));
    };
  }
}

const __breakpointListener = new BootstrapBreakpointEvent();

export function useBootstrapBreakpoint(returnBreakpointName = false) {
  const [breakpoint, setBreakpoint] = useState(__breakpointListener.current);

  useEffect(() => {
    const resizeEvent = (e) => setBreakpoint(returnBreakpointName ? BS_NAMES[e.detail] : e.detail);

    __breakpointListener.addEventListener('breakpoint', resizeEvent);
    return () => {
      __breakpointListener.removeEventListener('breakpoint', resizeEvent);
    };
  }, [returnBreakpointName]);

  return breakpoint;
}
