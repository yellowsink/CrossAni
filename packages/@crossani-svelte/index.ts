import "crossani";
import type { Transition } from "crossani";
import type { Readable, Writable } from "svelte/store";

type Trans = Transition | string;
type UpdateParams = Partial<
  [Readable<Trans>, Writable<Trans | undefined>, Record<string, Transition>]
>;

export default (
  node: HTMLElement,
  [stateStore, currentStore, transObj]: UpdateParams = []
) => {
  node.transitions = transObj;

  let queue: Trans[] = [];
  let lastState: Trans | undefined;

  function handleTransition(state: Trans) {
    if (state === lastState) return;
    lastState = state;
    if (!state) return;

    if ((typeof state === "object" ? state : node.transitions?.[state])?.detached) {
      node.doTransition(state);
      return;
    }

    if (queue.length === 0) currentStore?.set(state);

    queue.push(state);

    node.doTransition(state).then(() => {
      queue.shift();
      currentStore?.set(queue[0]);
    });
  }

  let unsub = stateStore?.subscribe(handleTransition);

  return {
    update([nuState, nuCurrent, nuTransObj]: UpdateParams = []) {
      if (nuState !== stateStore) {
        unsub?.();
        unsub = stateStore?.subscribe(handleTransition);
      }

      currentStore = nuCurrent;

      node.transitions = nuTransObj;
    },
    destroy() {
      unsub?.();
      node.removeCrossAni();
    },
  };
};

// useful types for people making suitable stores for CA with lang="ts"
export type InType = Trans
export type OutType = Trans | undefined