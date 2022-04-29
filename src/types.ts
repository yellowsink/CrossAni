/** Represents a transition that may run on an element at any given time */
interface Transition {
  /** A string map of CSS properties to their intended values */
  state: Record<string, undefined | string>;
  /** Number of milliseconds to transition for */
  ms: number;
  /** An easing function to use - see {@link EASE} */
  easing: string;
}

/* interface TransitionCollection extends Record<string, Transition> {
  default: Transition;
} */

/** @internal */
interface ElementState {
  orig: Record<string, string>
  curr: Record<string, string>
  queue: Transition[]
}

declare interface HTMLElement {
  /** A string map of transitions available on this element */
  transitions?: Record<string, undefined | Transition>;
  /** Runs transitions defined in HTMLElement.transitions by name */
  doTransition(name: string): void;
}
