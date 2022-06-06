import type { Transition } from "crossani";
import "crossani";
import { RefCallback, useRef } from "react";

export default (
  transitions: Record<string, Transition> = {}
): [
  RefCallback<HTMLElement | SVGElement>,
  (x: string | Transition) => void
] => {
  const elemRef = useRef<HTMLElement | SVGElement>();

  return [
    (elem) => {
      if (!elem) return;
      elemRef.current = elem;
      elem.transitions = transitions;
    },
    (trigger) => {
      elemRef.current?.doTransition(trigger);
    },
  ];
};
