import { PartSpr } from "./types";
import defaults from "./defaults";
import getSegments from "./getSegments";
import { EASE } from "crossani";

export type { PartSpr, SpringCfg } from "./types";

declare global {
  interface Element {
    doSpring: (
      start: number,
      end: number,
      prop: string,
      template: string,
      spring: PartSpr | string
    ) => Promise<void>;
    springs: Record<string, PartSpr>;
  }
}

Element.prototype.doSpring = function (start, end, prop, template, partCfg) {
  this.springs ??= {};
  const fullCfg = defaults(
    typeof partCfg === "object" ? partCfg : this.springs[partCfg]
  );

  const segments = getSegments(start, end, fullCfg);

  let lastPromise: Promise<void> | undefined;
  for (const [time, val] of segments) {
    const value = template.includes("<>")
      ? template.replace("<>", val.toString())
      : val + template;

    // @ts-expect-error
    lastPromise = this.doTransition({
      state: { [prop]: value },
      ms: time,
      easing: lastPromise ? EASE.inOut : EASE.out,
    });
  }

  return lastPromise ?? Promise.resolve();
};
