/** Represents a transition that may run on an element at any given time */
export interface Transition {
  /** A string map of CSS properties to their intended values */
  state: Record<string, string>;
  /** Number of milliseconds to transition for */
  ms: number;
  /** An easing function to use - see {@link EASE} */
  easing: string;
  /** If true, remove all crossani styles first */
  reset?: boolean;
  /** Cut off & run all queued transitions instantly instead of waiting */
  cutOff?: boolean;
}

/** A transition that may have missing properties */
export interface PartialTransition {
  state?: Record<string, string>;
  ms?: number;
  easing?: string;
  reset?: boolean;
  cutOff?: boolean;
}

/** @internal */
export interface ElementState {
  /** Stores the styles crossani is applying */
  orig: Record<string, string>;
  /** Inline styles present before crossani loaded */
  curr: Record<string, string>;
  /** Animations queued to run. First transition is currently running */
  queue: Transition[];
  /** Stores promises for transition completion */
  transitionPromises: [Transition, Promise<void>, () => void][];
}

declare global {
  interface Element {
    /** A string map of transitions available on this element */
    transitions?: Record<string, undefined | PartialTransition>;
    /** Runs transitions defined in Element.transitions by name */
    doTransition(name: PartialTransition | string): void;
    /** Removes CrossAni from this element */
    removeCrossAni(): void;
  }
}
