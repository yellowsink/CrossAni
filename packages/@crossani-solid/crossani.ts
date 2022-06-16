import { Transition } from "crossani";
import { Accessor, createEffect, Setter } from "solid-js";

export default (el: Element, argsAccessor: Accessor<CrossAniArgs>) => {
  const args = argsAccessor();
  const trigger = Array.isArray(args) ? args[0] : args;
  const stateOut = Array.isArray(args) ? args[1] : undefined;

  const queue = [] as (string | Transition)[];

  createEffect(() => {
    // @ts-expect-error el.transitions no exist wew
    if (typeof trigger() !== "object" && !el.transitions[trigger()]) return;

    if (queue.length === 0) stateOut?.(() => trigger());

    queue.push(trigger());

    el.doTransition(trigger()).then(() => {
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
