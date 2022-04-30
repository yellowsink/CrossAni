/** Represents a transition that may run on an element at any given time */
interface Transition {
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

/* interface TransitionCollection extends Record<string, Transition> {
  default: Transition;
} */

/** @internal */
interface ElementState {
  /** Stores the styles crossani is applying */
  orig: Record<string, string>;
  /** Inline styles present before crossani loaded */
  curr: Record<string, string>;
  /** Animations queued to run. First transition is currently running */
  queue: Transition[];
  /** Don't use directly: flag used to cut off queue advancement */
  //CANCEL?: Transition;
  /** Stores promises for transition completion */
  transitionPromises: WeakMap<
    Transition,
    [Promise<void>, () => void, (v?: any) => void]
  >;
}

declare interface HTMLElement {
  /** A string map of transitions available on this element */
  transitions?: Record<string, undefined | Transition>;
  /** Runs transitions defined in HTMLElement.transitions by name */
  doTransition(name: string): void;
}
