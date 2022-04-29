import { stateStore } from "./shared";

/** Converts a CSSStyleDeclaration to a Record<string, string> */
export const cloneStyles = (styles: CSSStyleDeclaration) => {
  // CSSStyleDeclaration is actually an array of props!
  const props = Object.values(styles);
  const entries = props.map((p) => [p, styles[p as any]]);
  return Object.fromEntries(entries);
};

/** Gets a store or inits if needed */
export const getOrInitStore = (
  elem: HTMLElement
): [ElementState, boolean] => {
  const state = stateStore.get(elem);
  if (state) return [state, false];

  const newState = {
    curr: {},
    orig: cloneStyles(elem.style),
    queue: [],
  };
  // new element
  stateStore.set(elem, newState);
  return [newState, true];
};

/** Updates the style tag according to the latest transition state etc */
export const updateStyles = (elem: HTMLElement) => {
  const [state, created] = getOrInitStore(elem);
  if (created) return;

  elem.style.cssText = "";
  Object.assign(elem.style, state.orig, state.curr);
};
