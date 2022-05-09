import { stateStore } from "./shared";

/** Converts a CSSStyleDeclaration to a Record<string, string> */
export function cloneStyles(styles: CSSStyleDeclaration) {
  // CSSStyleDeclaration is actually an array of props!
  const props = Object.values(styles).filter((s) => s !== "transition");
  const entries = props.map((p) => [p, styles[p as any]]);
  return Object.fromEntries(entries);
}

/** Gets a store or inits if needed */
export function getOrInitStore(elem: HTMLElement | SVGElement): ElementState {
  const state = stateStore.get(elem);
  if (state) return state;

  const newState = {
    curr: {},
    orig: cloneStyles(elem.style),
    queue: [],
    transitionPromises: [],
  };

  sanitiseStyleObject(newState.orig);

  // new element
  stateStore.set(elem, newState);
  return newState;
}

/** Updates the style tag according to the latest transition state etc */
export function updateStyles(elem: HTMLElement | SVGElement) {
  const state = getOrInitStore(elem);

  elem.style.cssText = `transition:${elem.style.transition}`;
  Object.assign(elem.style, state.orig, state.curr);
}

/** Queues a transition. Returns true if the element is not currently animati */
export function queueTransition(elem: HTMLElement | SVGElement, transition: Transition) {
  const state = getOrInitStore(elem);
  state.queue.push(transition);

  let resolve: () => void;
  const promise = new Promise<void>((res) => (resolve = res));

  state.transitionPromises.push([transition, promise, () => resolve()]);

  return state.queue.length === 1;
}

/** Gets the promise for a given transition */
export const getPromise = (elem: HTMLElement | SVGElement, transition: Transition) =>
  getOrInitStore(elem).transitionPromises.find(
    (t) => t[0] === transition
  )?.[1] ?? Promise.reject("promise was missing from state");

function sanitiseStyleObject(obj: Record<string, string>) {
  delete obj.transition;
  delete obj["transition-delay"];
  delete obj["transition-duration"];
  delete obj["transition-property"];
  delete obj["transition-timing-function"];
}

/** removes transition properties from states */
export function sanitiseTransitions(elem: HTMLElement | SVGElement) {
  if (elem.transitions === undefined) return;

  for (const transition of Object.values(elem.transitions)) {
    if (!transition) continue;
    sanitiseStyleObject(transition.state);
  }
}

/** listens for transitionend, but with a timeout */
export const eventOrTimeout = (
  elem: HTMLElement | SVGElement,
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

/** Waits for an element to finish transitioning before running callback, always run abortAnimation first */
export const whenTransitionAborts = (
  elem: HTMLElement | SVGElement,
  callback: () => void
) => {
  // see comment above usage in index.ts

  const animateOnceStopped = () =>
    requestAnimationFrame(
      elem.style.transitionProperty === "none" ? callback : animateOnceStopped
    );

  requestAnimationFrame(animateOnceStopped);
};
