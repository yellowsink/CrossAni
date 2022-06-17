import "crossani";
import type { Transition } from "crossani";

type Trans = Transition | string;
type CbFunc = (t: Trans) => void;
type UpdateParams = Partial<[Trans, CbFunc, Record<string, Transition>]>;

export default (node: HTMLElement) => {
  let queue: Trans[] = [];
  let queueCb: CbFunc | undefined;
  let lastState: Trans | undefined;

  return {
    destroy: () => node.removeCrossAni(),
    update([state, cb, transObj]: UpdateParams = []) {
      if (state === lastState) return;
      lastState = state ?? lastState;

      queueCb = cb;
      node.transitions = transObj;

      if (!state) return;

      if (queue.length === 0) queueCb?.(state);

      queue.push(state);

      node.doTransition(state).then(() => {
        queue.shift();
        queueCb?.(queue[0]);
      });
    },
  };
};
