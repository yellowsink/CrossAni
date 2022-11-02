/** Represents a transition that may run on an element at any given time */
export interface Transition {
  /** A string map of CSS properties to their intended values */
  state?: Record<string, string>;
  /** Number of milliseconds to transition for */
  ms?: number;
  /** An easing function to use - see {@link EASE} */
  easing?: string;
  /** If true, remove all crossani styles first */
  reset?: boolean;
  /** Cut off & run all queued transitions instantly instead of waiting */
  cutOff?: boolean;
  /** Don't track and queue this */
  detached?: boolean;
}

export type CssTransition = [number | undefined, string, string | undefined];

/** @internal */
export interface ElementState {
  /** Stores the styles crossani is applying */
  orig: Record<string, string>;
  /** Inline styles present before crossani loaded */
  curr: Record<string, string>;
  /** Animations queued to run. First transition is currently running */
  queue: Transition[];
  /** Stores promises for transition completion */
  transitionPromises: Map<Transition, [Promise<void>, () => void]>;
  /** Stores the previous ms value of the element */
  lastMs: number;
  /** Stores the previous ease value of the element */
  lastEase: string;
  /** Current running transitions */
  running: Map<string, CssTransition>;
}

declare global {
  interface Element {
    /** A string map of transitions available on this element */
    transitions?: Record<string, undefined | Transition>;

    /** Runs transitions defined in Element.transitions by name */
    doTransition(name: Transition | string): Promise<void>;

    /** Removes CrossAni from this element */
    removeCrossAni(): void;

    /** Stops currently running animations */
    forcePop(): Promise<void>;

    /** Sets a `style` property, updating it in crossani's copy too */
    caSet(prop: string, value: string): void;
  }
}
