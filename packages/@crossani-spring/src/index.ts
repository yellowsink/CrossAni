import { PartSpr } from "./types";
import defaults from "./defaults";
import getSegments from "./getSegments";
import { EASE } from "crossani";

export type { PartSpr, SpringCfg } from "./types";

const cancelSym = Symbol();

declare global {
  interface Element {
    doSpring: (
      start: number,
      end: number,
      prop: string,
      template: string,
      spring: PartSpr | string
    ) => Promise<void>;

    abortSprings: () => void;

    springs: Record<string, PartSpr>;

    [cancelSym]: boolean;
  }
}

Element.prototype.abortSprings = function () {
  this[cancelSym] = true;
};

Element.prototype.doSpring = async function (
  start,
  end,
  prop,
  template,
  partCfg
) {
  this.springs ??= {};
  this[cancelSym] = false;
  const fullCfg = defaults(
    typeof partCfg === "object" ? partCfg : this.springs[partCfg]
  );

  const segments = getSegments(start, end, fullCfg);

  let first = true;
  for (const [time, val] of segments) {
    if (this[cancelSym]) break;

    const value = template.includes("<>")
      ? template.replace("<>", val.toString())
      : val + template;

    await this.doTransition({
      state: { [prop]: value },
      ms: time,
      easing: first ? EASE.out : EASE.inOut,
      detached: true,
    });

    first = false;
  }
};
