import { stateStore } from "./shared";

/** Converts a CSSStyleDeclaration to a Record<string, string> */
export function cloneStyles(styles: CSSStyleDeclaration) {
  // CSSStyleDeclaration is actually an array of props!
  const props = Object.values(styles).filter((s) => s !== "transition");
  const entries = props.map((p) => [p, styles[p as any]]);
  return Object.fromEntries(entries);
}

/** Gets a store or inits if needed */
export function getOrInitStore(elem: HTMLElement): [ElementState, boolean] {
  const state = stateStore.get(elem);
  if (state) return [state, false];

  const newState = {
    curr: {},
    orig: cloneStyles(elem.style),
    queue: [],
    transitionPromises: [],
  };
  // new element
  stateStore.set(elem, newState);
  return [newState, true];
}

/** Updates the style tag according to the latest transition state etc */
export function updateStyles(elem: HTMLElement) {
  const [state, created] = getOrInitStore(elem);
  if (created) return;

  elem.style.cssText = `transition:${elem.style.transition}`;
  Object.assign(elem.style, state.orig, state.curr);
}

/** Queues a transition. Returns true if the element is not currently animati */
export function queueTransition(elem: HTMLElement, transition: Transition) {
  const [state] = getOrInitStore(elem);
  state.queue.push(transition);

  let resolve: () => void;
  const promise = new Promise<void>((res) => (resolve = res));

  state.transitionPromises.push([transition, promise, () => resolve()]);

  return state.queue.length === 1;
}

/** Gets the promise for a given transition */
export const getPromise = (elem: HTMLElement, transition: Transition) =>
  getOrInitStore(elem)[0].transitionPromises.find(
    (t) => t[0] === transition
  )?.[1] ?? Promise.reject("promise was missing from state");

/** removes transition properties from states */
export function sanitiseTransitions(elem: HTMLElement) {
  if (elem.transitions === undefined) return;

  for (const transition of Object.values(elem.transitions)) {
    if (!transition) continue;
    delete transition.state.transition;
    delete transition.state.transitionDelay;
    delete transition.state.transitionDuration;
    delete transition.state.transitionProperty;
    delete transition.state.transitionTimingFunction;
  }
}

export const eventOrTimeout = (
  elem: HTMLElement,
  resolve: () => void,
  timeout: number
) =>
  void setTimeout(() => {
    let cancel = false;

    const handler = () => {
      if (cancel) return;
      resolve();
      cancel = true;
    };

    elem.addEventListener("transitionend", handler, { once: true });

    setTimeout(() => {
      if (cancel) return;
      cancel = true;
      elem.removeEventListener("transitionend", handler);
      resolve();
    }, timeout);
  });
