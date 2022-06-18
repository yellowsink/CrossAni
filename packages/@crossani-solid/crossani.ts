import { Transition } from "crossani";
import { Accessor, createEffect, Setter } from "solid-js";

export default (el: Element, argsAccessor: Accessor<CrossAniArgs>) => {
  const args = argsAccessor();
  const trigger = Array.isArray(args) ? args[0] : args;
  const stateOut = Array.isArray(args) ? args[1] : undefined;

  const queue = [] as (string | Transition)[];

  createEffect(() => {
    const trans = trigger();
    if (typeof trans !== "object" && !el.transitions?.[trans]) return;

    if ((typeof trans === "object" ? trans : el.transitions?.[trans])?.detached) {
      el.doTransition(trans);
      return;
    }

    if (queue.length === 0) stateOut?.(() => trans);

    queue.push(trans);

    el.doTransition(trans).then(() => {
      queue.shift();
      stateOut?.(() => queue[0]);
    });
  });
};

type CrossAniArgs =
  | Accessor<string | Transition>
  | [
      triggerSignal: Accessor<string | Transition>,
      stateSignalOut: Setter<string | Transition | undefined>
    ];

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      crossani: CrossAniArgs;
    }
  }
}
